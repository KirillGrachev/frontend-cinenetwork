import { 
    Anime, 
    BannerItem, 
    AnimeDetails, 
    CharacterDetails, 
    NewsItem, 
    Collection, 
    Curator, 
    UserSettings, 
    UserProfileData,
    AdminPeriod,
    AdminUser,
    Incident
} from '../../types';
import { StatMetric, Transaction, TopContent, ActivityLogItem } from '../../hooks/useAdminStats';
import { Comment } from '../../hooks/useAdminComments';
import { LogEntry } from '../../hooks/useActivityLogLogic';

export interface IAnimeDataProvider {
    getFeaturedAnime(): Promise<Anime>;
    getNewReleases(): Promise<Anime[]>;
    getTrendingAnime(): Promise<Anime[]>;
    getFullCatalog(): Promise<Anime[]>;
    getHomeBanners(): Promise<BannerItem[]>;
    getFavorites(): Promise<Anime[]>;
    getAnimeDetails(id: number): Promise<AnimeDetails | undefined>;
    getCharacterDetails(id: number): Promise<CharacterDetails | undefined>;
    getStudioAnime(studioName: string): Promise<Anime[]>;
    search(query: string, filters?: any): Promise<Anime[]>;
}

export interface INewsDataProvider {
    getNewsItems(): Promise<NewsItem[]>;
    getNewsItemById(id: number): Promise<NewsItem | undefined>;
}

export interface ICollectionDataProvider {
    getCollections(): Promise<Collection[]>;
    getCollectionById(id: number): Promise<Collection | undefined>;
    getAnimeByCollectionId(id: number): Promise<Anime[]>;
    getCuratorsByCollectionId(id: number): Promise<Curator[]>;
}

export interface IUserDataProvider {
    getUserSettings(): Promise<UserSettings>;
    getUserProfile(id?: string | number): Promise<UserProfileData>;
}

export interface IAdminDataProvider {
    getStats(period: AdminPeriod): Promise<{
        metrics: StatMetric[];
        trafficHistory: number[];
        contentDistribution: { label: string; value: number; color: string }[];
        transactions: Transaction[];
        topContent: TopContent[];
        serverStats: { cpu: number; ram: number; storage: number; net: number };
        activityLog: ActivityLogItem[];
    }>;
    getUsers(): Promise<AdminUser[]>;
    getComments(): Promise<Comment[]>;
    getActivityLogs(): Promise<LogEntry[]>;
}

export interface IStatusDataProvider {
    getIncidents(): Promise<Incident[]>;
}
