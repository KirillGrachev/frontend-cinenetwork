import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Notification } from '../types';

// Control what the "backend" returns for sync tests.
const getNotificationsMock = vi.fn<() => Promise<Notification[]>>();
vi.mock('../services/apiService', () => ({
    notificationService: {
        getNotifications: () => getNotificationsMock(),
    },
}));

import { useNotificationStore, selectUnreadCount } from './notificationStore';

const makeNotification = (
    overrides: Partial<Notification> & Pick<Notification, 'id'>,
): Notification => ({
    title: `Notification ${overrides.id}`,
    description: 'desc',
    time: new Date(0).toISOString(),
    isRead: false,
    type: 'system',
    ...overrides,
});

describe('notificationStore', () => {
    beforeEach(() => {
        useNotificationStore.setState({ notifications: [], isLoading: false });
        getNotificationsMock.mockReset();
    });

    it('adds a notification', () => {
        useNotificationStore.getState().addNotification(makeNotification({ id: 1 }));

        const { notifications } = useNotificationStore.getState();
        expect(notifications).toHaveLength(1);
        expect(notifications[0].title).toBe('Notification 1');
    });

    it('ignores duplicates by id', () => {
        const { addNotification } = useNotificationStore.getState();
        addNotification(makeNotification({ id: 1 }));
        addNotification(makeNotification({ id: 1, title: 'dup' }));

        expect(useNotificationStore.getState().notifications).toHaveLength(1);
    });

    it('marks one / all as read', () => {
        const { addNotification } = useNotificationStore.getState();
        addNotification(makeNotification({ id: 1 }));
        addNotification(makeNotification({ id: 2 }));

        useNotificationStore.getState().markAsRead(1);
        expect(selectUnreadCount(useNotificationStore.getState())).toBe(1);

        useNotificationStore.getState().markAllAsRead();
        expect(selectUnreadCount(useNotificationStore.getState())).toBe(0);
    });

    describe('syncWithBackend', () => {
        it('merges remote notifications, preserving local read state', async () => {
            getNotificationsMock.mockResolvedValue([
                makeNotification({ id: 1, title: 'server-1', isRead: false }),
                makeNotification({ id: 2, title: 'server-2', isRead: false }),
            ]);

            // Locally the user already read #1 and has a local-only item #3.
            useNotificationStore.setState({
                notifications: [
                    makeNotification({ id: 1, isRead: true }),
                    makeNotification({ id: 3 }),
                ],
            });

            await useNotificationStore.getState().syncWithBackend();

            const { notifications } = useNotificationStore.getState();
            expect(notifications.map((n) => n.id).sort()).toEqual([1, 2, 3]);
            expect(notifications.find((n) => n.id === 1)?.isRead).toBe(true); // local read wins
            expect(notifications.find((n) => n.id === 1)?.title).toBe('server-1'); // content from server
            expect(notifications.find((n) => n.id === 3)).toBeDefined(); // local-only kept
        });

        it('sorts by time descending and caps the list', async () => {
            const many = Array.from({ length: 120 }, (_, i) =>
                makeNotification({ id: i, time: new Date(i * 60_000).toISOString() }),
            );
            getNotificationsMock.mockResolvedValue(many);

            await useNotificationStore.getState().syncWithBackend();

            const { notifications } = useNotificationStore.getState();
            expect(notifications).toHaveLength(100);
            expect(notifications[0].id).toBe(119); // newest first
        });

        it('keeps local data and clears the loading flag when the backend fails', async () => {
            useNotificationStore.setState({ notifications: [makeNotification({ id: 9 })] });
            getNotificationsMock.mockRejectedValue(new Error('offline'));

            await expect(
                useNotificationStore.getState().syncWithBackend(),
            ).resolves.toBeUndefined();

            const state = useNotificationStore.getState();
            expect(state.notifications).toHaveLength(1);
            expect(state.isLoading).toBe(false);
        });
    });
});
