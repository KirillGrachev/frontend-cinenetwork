import type { INotificationService, Notification } from '../types';
import type { INotificationDataProvider } from './providers/types';
import { getNotificationDataProvider } from './providers/providerFactory';

/**
 * Notification data now comes from the provider layer like every other
 * domain — previously the mock fixture was hardcoded inside this service,
 * breaking the provider pattern the rest of the app follows.
 */
export class NotificationService implements INotificationService {
    constructor(
        private readonly provider: INotificationDataProvider = getNotificationDataProvider(),
    ) {}

    getNotifications = (): Promise<Notification[]> => {
        return this.provider.getNotifications();
    };
}
