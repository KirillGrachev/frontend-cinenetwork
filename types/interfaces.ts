import type React from 'react';
import type {
    AnimeType,
    ContentType,
    SortOptionValue,
    CatalogSelection,
    ServiceStatus,
    VideoQuality,
    ToastType,
    AnimeGenre,
    CuratorRole,
    UserRole,
    UserStatus,
} from './enums';

// --- DATA INTERFACES ---

export interface Anime {
    id: number;
    title: string;
    description: string;
    thumbnailUrl: string; // Vertical poster
    coverUrl: string; // Horizontal wide image
    rating: number; // 0-10
    genres: AnimeGenre[]; // Updated to use Enum
    year: number;
    studio?: string;
    type?: AnimeType;
}

export interface Collection {
    id: number;
    title: string;
    count: number;
    image: string;
    color: string;
}

/** Collection enriched with preview imagery for grids/carousels. */
export interface CollectionViewModel extends Collection {
    previews: string[];
    bgImages: string[];
}

export interface Curator {
    id: number;
    username: string;
    role: CuratorRole;
    contributions: number;
    joinDate: string;
}

export interface Voiceover {
    id: string;
    name: string;
    language: 'ru' | 'en' | 'jp' | 'other';
    author?: string; // e.g. "AniLibria"
}

export interface SimpleComment {
    id: number;
    userId: string;
    username: string;
    avatarUrl?: string;
    content: string;
    date: string;
    likes?: number;
}

export interface Character {
    id: number;
    name: string;
    role: 'Main' | 'Supporting';
    imageUrl: string;
}

export interface VoiceActor {
    id: number;
    name: string;
    language: string;
    imageUrl: string;
}

export interface CharacterDetails {
    id: number;
    name: string;
    originalName?: string;
    role: 'Main' | 'Supporting';
    imageUrl: string;
    description: string;
    anime: Anime[]; // Appearances
    voiceActors: VoiceActor[];
}

export interface Episode {
    id: number;
    number: number;
    title: string;
    image: string;
    duration: string; // e.g. "24 min"
    airDate?: string;
}

export interface Review {
    id: number;
    userId: string;
    username: string;
    avatarUrl?: string;
    rating: number;
    date: string;
    content: string;
    likes: number;
    isSpoiler?: boolean;
}

export interface AnimeDetails extends Anime {
    originalTitle?: string;
    status: 'ongoing' | 'released' | 'announced';
    duration?: string; // "24 min"
    ageRating?: string; // "16+"
    source?: string; // Added source property
    episodesCount?: number;
    screenshots?: string[];
    characters?: Character[];
    episodesList?: Episode[];
    similar?: Anime[];
    franchise?: Anime[]; // Added franchise field for related seasons/movies
    reviews?: Review[];
    comments?: SimpleComment[]; // Added simple comments
    voiceovers?: Voiceover[]; // Added voiceovers
}

export interface AdminUser {
    id: string;
    username: string;
    email: string;
    avatarUrl: string | null;
    role: UserRole;
    status: UserStatus;
    joinDate: string;
    banReason?: string;
}

export interface HistoryItem {
    id: string; // Unique ID for the history record
    anime: Anime;
    episode: number;
    timestamp: number; // Unix timestamp
    progress: number; // Percentage 0-100
    lastWatchedAt: string; // ISO String or display string
}

export interface SectionProps {
    title: string;
    items: Anime[];
}

export interface BannerItem {
    id: number;
    imageUrl: string;
    alt: string;
    link?: string;
}

export interface ContentBlock {
    type: ContentType;
    content?: string;
    items?: { title: string; subtitle: string; desc: string; color: string }[]; // For feature grids
}

export interface NewsItem {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    tags: string[];
    isFeatured?: boolean;
    // Full post data
    contentBlocks?: ContentBlock[];
    toc?: string[]; // Table of Contents headers
}

export interface Notification {
    id: number;
    title: string;
    description: string;
    time: string; // ISO string or relative time
    isRead: boolean;
    type: 'system' | 'like' | 'comment' | 'release';
    image?: string;
    link?: string;
}

// --- CONFIGURATION TYPES ---

export interface SortOption {
    label: string;
    value: SortOptionValue;
    icon: string;
}

export interface CatalogConfig {
    seasons: string[];
    genres: string[];
    studios: string[];
    yearRange: { min: number; max: number };
    selections: { label: string; value: CatalogSelection }[];
    sortOptions: SortOption[];
}

export interface FooterConfig {
    navLinks: { label: string; view: string }[];
    userLinks: { label: string; view: string }[];
    socialLinks: { label: string; icon: string; href: string }[];
    emails: { copyright: string; contact: string };
    legalText: string;
    copyrightText: string;
    languages: { code: string; label: string }[];
}

export interface AuthConfig {
    socialProviders: string[];
}

export interface ScheduleDay {
    id: string;
    label: string;
    short: string;
}

export interface NewsPageConfig {
    title: string;
    description: string;
}

export interface ServiceItem {
    id: string;
    name: string;
    status: ServiceStatus;
    uptime: number;
    latency?: number;
    history: number[];
}

export interface ServiceGroup {
    name: string;
    services: ServiceItem[];
}

export interface Incident {
    id: string;
    title: string;
    status: string;
    updatedAt: string;
}

export interface SupportTopic {
    id: string;
    label: string;
}

export interface UserSettings {
    id: number | string;
    username: string;
    email: string;
    avatarUrl?: string;
    isPremium: boolean;
    /** Access role; absent for legacy persisted sessions (treated as User). */
    role?: UserRole;
    preferences: {
        autoplay: boolean;
        quality: VideoQuality;
        notifications: boolean;
    };
}

// --- PROFILE TYPES ---
export interface ProfileStats {
    totalWatchedEpisodes: number;
    totalTitles: number;
    daysWatched: number; // e.g. 14.5 days
    commentsCount: number;
    reviewsCount: number;
    averageScore: number; // 0-10
}

export interface Achievement {
    id: string;
    icon: string;
    title: string;
    description: string;
    unlockedAt: string;
    color: string;
}

export interface ProfileActivityItem {
    id: string;
    type: 'watched' | 'rated' | 'commented' | 'added_list' | 'achievement';
    title: string;
    timestamp: string;
    meta?: string; // e.g. "Rated 9/10" or "Episode 12"
    image?: string;
    link?: string;
}

export interface UserProfileData extends UserSettings {
    joinDate: string;
    coverUrl?: string;
    level: number;
    xp: number;
    nextLevelXp: number;
    bio?: string;
    stats: ProfileStats;
    viewingDynamics: number[]; // Array of numbers representing episodes per day (last 14 days)
    achievements: Achievement[];
    recentActivity: ProfileActivityItem[];
    friends: { id: string; username: string; avatarUrl?: string; level: number }[];
    collections: Collection[]; // User created collections
    ratedAnime: { id: number; title: string; image: string; rating: number }[]; // Sample of rated anime
    comments: { id: number; animeTitle: string; content: string; date: string }[]; // Sample of comments
}

export interface DocSection {
    id: string;
    title: string;
    content: string | React.ReactNode;
}

export interface AuthCredentials {
    email: string;
    password: string;
}

/** Result of a successful login: session token + the full profile. */
export interface AuthSession {
    token: string;
    user: UserProfileData;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    user: UserProfileData | null;
    /**
     * Authenticates the user. `credentials` are optional because some flows
     * (e.g. auto-login right after e-mail verification) have no form values;
     * with a real backend the session token would come from the verification
     * step instead.
     */
    login: (credentials?: AuthCredentials) => Promise<void>;
    logout: () => void;
}

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    isClosing?: boolean;
}

export interface ToastContextType {
    toasts: Toast[];
    showToast: (message: string, type: ToastType) => void;
    removeToast: (id: string) => void;
    hasToasts: boolean;
}

export interface SearchFilters {
    genre?: string;
    year?: string;
    studio?: string;
}

// Service Interfaces
export interface IAnimeService {
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

export interface INewsService {
    getNewsItems(): Promise<NewsItem[]>;
    getNewsItemById(id: number): Promise<NewsItem | undefined>;
    search(query: string): Promise<NewsItem[]>;
}

export interface ICollectionService {
    getCollections(): Promise<Collection[]>;
    getCollectionById(id: number): Promise<Collection | undefined>;
    getAnimeByCollectionId(id: number): Promise<Anime[]>;
    getCuratorsByCollectionId(id: number): Promise<Curator[]>;
    search(query: string): Promise<Collection[]>;
}

export interface IUserService {
    getUserSettings(): Promise<UserSettings>;
    getUserProfile(id?: string | number): Promise<UserProfileData>;
}

export interface INotificationService {
    getNotifications(): Promise<Notification[]>;
}
