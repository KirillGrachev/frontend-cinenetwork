import { BaseService } from './BaseService';
import { INotificationService, Notification } from '../types';

export class NotificationService extends BaseService implements INotificationService {
  
  getNotifications = (): Promise<Notification[]> => {
    return this.cachedRequest('notifications', async () => {
        await this.fakeDelay(500); // Simulate network latency
        
        // Mock data from "Backend"
        // In a real app, this would come from an API endpoint like /api/notifications
        const notifications: Notification[] = [
            { 
                id: 101, 
                title: 'Система', 
                description: 'Добро пожаловать в CineNetwork! Настройте свой профиль.', 
                time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
                isRead: true, 
                type: 'system' 
            },
            { 
                id: 102, 
                title: 'Новый эпизод', 
                description: 'Вышла 12 серия "Магическая битва"', 
                time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
                isRead: false, 
                type: 'release', 
                image: '/assets/jujutsu-kaisen/poster.jpeg',
                link: '/watch/1?ep=12'
            },
            { 
                id: 103, 
                title: 'NarutoFan99', 
                description: 'Понравился ваш комментарий к "Человек-бензопила"', 
                time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
                isRead: false, 
                type: 'like',
                link: '/anime/9?tab=comments'
            },
            // Simulate a new one appearing recently
            {
                id: 104,
                title: 'Технические работы',
                description: 'Серверы будут перезагружены через 10 минут.',
                time: new Date().toISOString(),
                isRead: false,
                type: 'system'
            }
        ];
        
        return notifications;
    });
  }
}