import { describe, it, expect, beforeEach } from 'vitest';
import { useNotificationStore } from './notificationStore';
import { Notification } from '../types';

describe('notificationStore', () => {
    beforeEach(() => {
        // Reset the store before each test
        useNotificationStore.setState({ notifications: [], isLoading: false });
    });

    it('should add a notification', () => {
        const store = useNotificationStore.getState();
        const mockNotif: Notification = {
            id: 1,
            title: 'Test',
            message: 'Test Message',
            time: new Date().toISOString(),
            isRead: false,
            icon: 'test',
            color: 'blue'
        };

        store.addNotification(mockNotif);

        expect(useNotificationStore.getState().notifications).toHaveLength(1);
        expect(useNotificationStore.getState().notifications[0].title).toBe('Test');
    });

    it('should mark a notification as read', () => {
        const store = useNotificationStore.getState();
        const mockNotif: Notification = {
            id: 1,
            title: 'Test',
            message: 'Test Message',
            time: new Date().toISOString(),
            isRead: false,
            icon: 'test',
            color: 'blue'
        };

        store.addNotification(mockNotif);
        useNotificationStore.getState().markAsRead(1);

        expect(useNotificationStore.getState().notifications[0].isRead).toBe(true);
    });

    it('should get correct unread count', () => {
        const store = useNotificationStore.getState();
        
        store.addNotification({ id: 1, title: 'Test 1', message: 'M', time: '', isRead: false, icon: '', color: 'blue' });
        store.addNotification({ id: 2, title: 'Test 2', message: 'M', time: '', isRead: true, icon: '', color: 'blue' });

        expect(useNotificationStore.getState().getUnreadCount()).toBe(1);
    });
});
