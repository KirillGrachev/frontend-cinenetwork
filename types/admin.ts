import type {
    ActivityType,
    AnimeType,
    CommentStatus,
    FlagReason,
    TransactionStatus,
    Trend,
} from './enums';

/**
 * Domain types for the admin panel.
 *
 * These used to live inside UI hooks (useAdminStats / useAdminComments /
 * useActivityLogLogic), which forced the service layer to import from the
 * presentation layer — an inverted dependency. They now live in the type
 * layer, which every other layer may import from.
 */

export interface StatMetric {
    id: string;
    label: string;
    value: number;
    change: string;
    trend: Trend;
    icon: string;
    color: string;
}

export interface ActivityLogItem {
    id: number;
    action: string;
    user: string;
    time: string;
    type: ActivityType;
}

export interface Transaction {
    id: string;
    user: string;
    plan: string;
    amount: string;
    status: TransactionStatus;
    date: string;
}

export interface TopContent {
    id: number;
    title: string;
    views: number;
    rating: number;
    image: string;
    type: AnimeType;
}

export interface ContentDistributionSlice {
    label: string;
    value: number;
    color: string;
}

/**
 * Content-platform health, as opposed to raw server telemetry: what an
 * anime-service operator actually manages (media library, encoding pipeline,
 * CDN delivery, concurrent streams). All values are 0-100 load percentages;
 * `cdn` is displayed in Gbit/s.
 */
export interface PlatformStats {
    media: number;
    encoding: number;
    cdn: number;
    streams: number;
}

export interface AdminStats {
    metrics: StatMetric[];
    trafficHistory: number[];
    contentDistribution: ContentDistributionSlice[];
    transactions: Transaction[];
    topContent: TopContent[];
    platformStats: PlatformStats;
    activityLog: ActivityLogItem[];
}

export interface TicketMessage {
    id: string;
    sender: 'user' | 'admin';
    content: string;
    timestamp: string;
}

export type AdminContentType = 'comment' | 'review' | 'ticket';

export type AdminSection = 'comments' | 'reviews' | 'tickets';

export interface Comment {
    id: string;
    userId: string;
    username: string;
    avatar: string | null;
    content: string;
    animeTitle: string;
    episode?: number;
    time: string;
    status: CommentStatus;
    flagReason: FlagReason | null;
    rating?: number;
    type: AdminContentType;
    messages?: TicketMessage[];
    reportsCount?: number;
}

export interface LogEntry {
    id: number;
    action: string;
    description: string;
    user: string;
    time: string;
    type: ActivityType;
    ip: string;
}
