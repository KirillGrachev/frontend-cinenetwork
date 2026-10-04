import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Notification } from '../types';
import { notificationService } from '../services/apiService';

/** Notifications kept in the persisted store (protects localStorage quota). */
const NOTIFICATIONS_LIMIT = 100;

export interface NotificationState {
    notifications: Notification[];
    isLoading: boolean;

    addNotification: (notification: Notification) => void;
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;

    /** Pull backend notifications and merge with locally read state. */
    syncWithBackend: () => Promise<void>;
}

/** Derived selector (replaces the former in-store `getUnreadCount` method). */
export const selectUnreadCount = (state: NotificationState): number =>
    state.notifications.reduce((count, n) => count + (n.isRead ? 0 : 1), 0);

/**
 * Merge policy (documented, unlike the previous dead `else` branch):
 *  - backend is the source of truth for *content*;
 *  - a notification already marked read locally stays read even if the
 *    server still reports it unread (local user action wins until a
 *    read-receipt API exists);
 *  - result is sorted by time desc and capped at NOTIFICATIONS_LIMIT.
 */
function mergeNotifications(local: Notification[], remote: Notification[]): Notification[] {
    const readLocally = new Set(local.filter((n) => n.isRead).map((n) => n.id));

    const merged = new Map<number, Notification>();
    for (const notification of remote) {
        merged.set(notification.id, {
            ...notification,
            isRead: notification.isRead || readLocally.has(notification.id),
        });
    }
    // Keep local-only entries (e.g. optimistic/pushed ones the backend
    // doesn't return yet) instead of silently dropping user-visible data.
    for (const notification of local) {
        if (!merged.has(notification.id)) merged.set(notification.id, notification);
    }

    return [...merged.values()]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, NOTIFICATIONS_LIMIT);
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [],
            isLoading: false,

            addNotification: (notification) =>
                set((state) => {
                    if (state.notifications.some((n) => n.id === notification.id)) return state;
                    return {
                        notifications: [notification, ...state.notifications].slice(
                            0,
                            NOTIFICATIONS_LIMIT,
                        ),
                    };
                }),

            markAsRead: (id) =>
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, isRead: true } : n,
                    ),
                })),

            markAllAsRead: () =>
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.isRead ? n : { ...n, isRead: true },
                    ),
                })),

            clearNotifications: () => set({ notifications: [] }),

            syncWithBackend: async () => {
                if (get().isLoading) return;
                set({ isLoading: true });
                try {
                    const remote = await notificationService.getNotifications();
                    set({ notifications: mergeNotifications(get().notifications, remote) });
                } catch (error) {
                    // Offline / backend down: keep showing persisted data.
                    console.error('Failed to sync notifications:', error);
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'cine-network-notifications',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ notifications: state.notifications }),
        },
    ),
);
