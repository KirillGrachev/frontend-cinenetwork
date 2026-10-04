import type { AdminSection, AdminStats, AdminUser, Comment, LogEntry } from '../types';
import type { AdminPeriod } from '../types';
import type { IAdminDataProvider } from './providers/types';
import { getAdminDataProvider } from './providers/providerFactory';

export class AdminService {
    constructor(private readonly provider: IAdminDataProvider = getAdminDataProvider()) {}

    getStats = (period: AdminPeriod): Promise<AdminStats> => {
        return this.provider.getStats(period);
    };

    getUsers = (): Promise<AdminUser[]> => {
        return this.provider.getUsers();
    };

    getComments = (section: AdminSection): Promise<Comment[]> => {
        return this.provider.getComments(section);
    };

    getActivityLog = (): Promise<LogEntry[]> => {
        return this.provider.getActivityLogs();
    };
}
