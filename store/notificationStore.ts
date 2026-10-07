import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Notification } from '../types';
import { notificationService } from '../services/apiService';

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  
  // Actions
  addNotification: (notification: Notification) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  
  // Sync logic
  syncWithBackend: () => Promise<void>;
  
  // Getters (computed properties pattern in Zustand)
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      isLoading: false,

      addNotification: (notification) =>
        set((state) => {
          // Avoid duplicates by ID
          if (state.notifications.some((n) => n.id === notification.id)) return state;
          return { notifications: [notification, ...state.notifications] };
        }),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),

      clearNotifications: () => set({ notifications: [] }),

      getUnreadCount: () => get().notifications.filter((n) => !n.isRead).length,

      syncWithBackend: async () => {
        set({ isLoading: true });
        try {
          // Fetch from backend
          const backendNotifications = await notificationService.getNotifications();
          const currentNotifications = get().notifications;

          // Merge Strategy: 
          // 1. Keep local read status if the notification exists locally.
          // 2. Add new notifications from backend that don't exist locally.
          
          const merged = [...currentNotifications];
          
          backendNotifications.forEach(serverNotif => {
              const existingIndex = merged.findIndex(local => local.id === serverNotif.id);
              
              if (existingIndex === -1) {
                  // It's new! Add to top.
                  merged.unshift(serverNotif);
              } else {
                  // It exists. Update content if needed, but preserve 'isRead' from local if it was read locally
                  // (Logic: if local says read, it's read. If local says unread, trust server? 
                  // Usually local user action > server state in simple sync)
                  // For now, we strictly preserve local 'isRead' state.
                  // Only update if server has changed content (not implementing deep compare here for simplicity)
              }
          });

          // Sort by time descending
          merged.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

          set({ notifications: merged });
        } catch (error) {
          console.error('Failed to sync notifications:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'cine-network-notifications', // LocalStorage Key
      storage: createJSONStorage(() => localStorage),
      // Don't persist isLoading status
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);