import type {
    AdminSection,
    AuthCredentials,
    AuthSession,
    AdminStats,
    AdminUser,
    Anime,
    AnimeDetails,
    BannerItem,
    CharacterDetails,
    Collection,
    Comment,
    Curator,
    Incident,
    LogEntry,
    NewsItem,
    Notification,
    SearchFilters,
    ServiceGroup,
    UserSettings,
    UserProfileData,
} from '../../types';
import type { AdminPeriod } from '../../types';

/**
 * Data-provider contracts.
 *
 * A provider is the single source of truth for *where data comes from*
 * (mock fixtures vs. real REST API). Services depend on these interfaces
 * only — never on a concrete provider.
 *
 * NOTE: all domain types are imported from `types/` — services must not
 * import from UI hooks (that inverts the dependency graph).
 */

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
    search(query: string, filters?: SearchFilters): Promise<Anime[]>;
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

export interface INotificationDataProvider {
    getNotifications(): Promise<Notification[]>;
}

export interface IAdminDataProvider {
    getStats(period: AdminPeriod): Promise<AdminStats>;
    getUsers(): Promise<AdminUser[]>;
    getComments(section: AdminSection): Promise<Comment[]>;
    getActivityLogs(): Promise<LogEntry[]>;
}

export interface IStatusDataProvider {
    getIncidents(): Promise<Incident[]>;
    getSystemStatus(): Promise<ServiceGroup[]>;
}

export interface IAuthDataProvider {
    login(credentials: AuthCredentials): Promise<AuthSession>;
    logout(): Promise<void>;
    /** Validates the current session server-side and returns the profile. */
    getCurrentUser(): Promise<UserProfileData>;
}
