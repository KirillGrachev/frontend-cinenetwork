import { BaseService } from './BaseService';
import { 
    AdminPeriod, 
    CommentStatus,
    FlagReason,
    ActivityType
} from '../types';
import { StatMetric, Transaction, TopContent, ActivityLogItem } from '../hooks/useAdminStats';
import { AdminUser } from '../types';
import { Comment } from '../hooks/useAdminComments';
import { LogEntry } from '../hooks/useActivityLogLogic';
import { IAdminDataProvider } from './providers/types';
import { getAdminDataProvider } from './providers/providerFactory';

export class AdminService extends BaseService {
    constructor(private provider: IAdminDataProvider = getAdminDataProvider()) {
        super();
    }

    // --- Stats ---
    getStats = (period: AdminPeriod): Promise<{
        metrics: StatMetric[];
        trafficHistory: number[];
        contentDistribution: { label: string; value: number; color: string }[];
        transactions: Transaction[];
        topContent: TopContent[];
        serverStats: { cpu: number; ram: number; storage: number; net: number };
        activityLog: ActivityLogItem[];
    }> => {
        return this.cachedRequest(`adminStats_${period}`, () => this.provider.getStats(period));
    }

    // --- Users ---
    getUsers = (): Promise<AdminUser[]> => {
        return this.cachedRequest('adminUsers', () => this.provider.getUsers());
    }

    // --- Comments / Moderation ---
    getComments = (section: 'comments' | 'reviews' | 'tickets'): Promise<Comment[]> => {
        return this.cachedRequest(`adminComments_${section}`, async () => {
            const rawComments = await this.provider.getComments();
            // Process section filtering or formatting
            return rawComments;
        });
    }

    // --- Activity Log ---
    getActivityLog = (): Promise<LogEntry[]> => {
        return this.cachedRequest('adminActivityLog', () => this.provider.getActivityLogs());
    }
}
