export const FILTER_ALL = 'all';

// --- Routes ---
export enum AppRoute {
    Home = '/',
    Catalog = '/catalog',
    Collections = '/collections',
    Schedule = '/schedule',
    News = '/news',
    Docs = '/docs',
    Login = '/login',
    Register = '/register',
    ForgotPassword = '/forgot-password',
    VerifyEmail = '/verify-email',
    Settings = '/settings',
    Status = '/status',
    Support = '/support',
    Favorites = '/favorites',
    History = '/history',
    Search = '/search',
    TopCharts = '/top',
    Watch = '/watch',
    Profile = '/profile',
    Notifications = '/notifications',
    AdminStats = '/admin/stats',
    AdminModeration = '/admin/moderation',
    AdminActivity = '/admin/activity',
    AdminUsers = '/admin/users',
}

// --- Query Keys ---
export enum QueryKey {
    Favorites = 'favorites',
    FullCatalog = 'fullCatalog',
    NewsItems = 'newsItems',
    NewsItem = 'newsItem',
    Collections = 'collections',
    Collection = 'collection',
    CollectionAnime = 'collectionAnime',
    CollectionCurators = 'collectionCurators',
    UserHistory = 'userHistory',
    UserSettings = 'userSettings',
    UserProfile = 'userProfile',
    HomeData = 'homeData',
    SearchResults = 'searchResults',
    SearchPage = 'searchPage',
    FeaturedAnime = 'featuredAnime',
    NewReleases = 'newReleases',
    TrendingAnime = 'trendingAnime',
    HomeBanners = 'homeBanners',
}

// --- Roles ---
export enum CuratorRole {
    Admin = 'admin',
    Moderator = 'moderator',
    Contributor = 'contributor',
}

// --- User Management Roles ---
export enum UserRole {
    Admin = 'admin',
    Moderator = 'moderator',
    User = 'user',
}

export enum UserStatus {
    Active = 'active',
    Banned = 'banned',
}

// --- Genres ---
export enum AnimeGenre {
    Action = 'action',
    Adventure = 'adventure',
    Comedy = 'comedy',
    Drama = 'drama',
    Romance = 'romance',
    SliceOfLife = 'slice_of_life',
    Fantasy = 'fantasy',
    SciFi = 'sci_fi',
    Shonen = 'shonen',
    Shojo = 'shojo',
    Seinen = 'seinen',
    Josei = 'josei',
    Kodomo = 'kodomo',
    SchoolLife = 'school_life',
    Historical = 'historical',
    Military = 'military',
    Space = 'space',
    Cyberpunk = 'cyberpunk',
    Steampunk = 'steampunk',
    PostApocalyptic = 'post_apocalyptic',
    Isekai = 'isekai',
    VirtualReality = 'virtual_reality',
    Sports = 'sports',
    Music = 'music',
    Game = 'game',
    Mecha = 'mecha',
    Magic = 'magic',
    Vampires = 'vampires',
    Demons = 'demons',
    MartialArts = 'martial_arts',
    Samurai = 'samurai',
    Ninja = 'ninja',
    Police = 'police',
    Mystery = 'mystery',
    Thriller = 'thriller',
    Psychological = 'psychological',
    Horror = 'horror',
    Mystic = 'mystic',
    Parody = 'parody',
    Dementia = 'dementia',
    Suspense = 'suspense',
    Harem = 'harem',
    Workplace = 'workplace',
    Family = 'family',
    Food = 'food',
    Idol = 'idol',
    Supernatural = 'supernatural',
}

export enum SearchCategory {
    Anime = 'anime',
    Collections = 'collections',
    News = 'news',
}

export enum AppView {
    Home = 'home',
    Catalog = 'catalog',
    Collections = 'collections',
    Schedule = 'schedule',
    News = 'news',
    Docs = 'docs',
    Login = 'login',
    Register = 'register',
    Settings = 'settings',
    Status = 'status',
    Support = 'support',
    Favorites = 'favorites',
    History = 'history',
    AdminStats = 'admin/stats',
    AdminModeration = 'admin/moderation',
    AdminUsers = 'admin/users',
    Search = 'search',
    BlogPost = 'blog-post',
    TopCharts = 'top-charts',
    Watch = 'watch',
    Profile = 'profile',
    Notifications = 'notifications',
}

export enum FavoriteStatus {
    Watching = 'watching',
    Planned = 'planned',
    Completed = 'completed',
    Dropped = 'dropped',
    Paused = 'paused',
}

export enum FavoriteTab {
    Anime = 'anime',
    Collections = 'collections',
}

export enum ServiceStatus {
    Operational = 'operational',
    Degraded = 'degraded',
    Outage = 'outage',
    Maintenance = 'maintenance',
}

export enum AnimeType {
    TV = 'TV',
    Movie = 'Movie',
}

export enum CatalogSelection {
    Trending = 'trending',
    New = 'new',
    Best = 'best',
    Movies = 'movies',
}

export enum CatalogFilterType {
    Seasons = 'seasons',
    Genres = 'genres',
    Studios = 'studios',
    Selections = 'selections',
}

export enum SortOptionValue {
    Popularity = 'popularity',
    Rating = 'rating',
    Newest = 'newest',
    Alphabet = 'alphabet',
}

export enum CollectionFilter {
    All = 'all',
    Editorial = 'editorial',
    Community = 'community',
}

export enum SettingsTab {
    Profile = 'profile',
    Preferences = 'preferences',
    Player = 'player',
}

export enum SocialProviderId {
    Google = 'google',
    Telegram = 'telegram',
    Discord = 'discord',
    Yandex = 'yandex',
}

export enum AttachmentType {
    File = 'file',
    Link = 'link',
}

export enum SortDirection {
    Asc = 'asc',
    Desc = 'desc',
}

// Admin Enums
export enum CommentStatus {
    Pending = 'pending',
    Flagged = 'flagged',
    Approved = 'approved',
    Rejected = 'rejected',
}

export enum FlagReason {
    UserReport = 'user_report',
    Spam = 'spam',
    Offensive = 'offensive',
    Spoiler = 'spoiler',
}

export enum BanDuration {
    None = 'none',
    Hour1 = '1h',
    Day24 = '24h',
    Week1 = '7d',
    Permanent = 'perm',
}

export enum Trend {
    Up = 'up',
    Down = 'down',
    Neutral = 'neutral',
}

export enum TransactionStatus {
    Completed = 'completed',
    Pending = 'pending',
}

export enum ActivityType {
    Success = 'success',
    Warning = 'warning',
    Info = 'info',
}

export enum AdminTab {
    Overview = 'overview',
    Content = 'content',
    Finance = 'finance',
    System = 'system',
}

export enum AdminContentFilter {
    All = 'all',
    TV = 'tv',
    Movie = 'movie',
}

export enum AdminPeriod {
    Day24 = 'd24',
    Day7 = 'd7',
    Day30 = 'd30',
}

// History Enums
export enum HistoryGroup {
    Today = 'today',
    Yesterday = 'yesterday',
    Earlier = 'earlier',
}

export enum HistoryClearPeriod {
    LastHour = 'hour',
    Today = 'today',
    AllTime = 'all',
}

// Top Charts Enums
export enum TopPeriod {
    Week = 'week',
    Month = 'month',
    Year = 'year',
    AllTime = 'all',
}

export enum TopMetric {
    Views = 'views',
    Rating = 'rating',
}

// Curator Modal Enums
export enum CuratorStep {
    Intro = 'intro',
    Form = 'form',
}

// Blog & User Enums
export enum ContentType {
    Paragraph = 'paragraph',
    Heading = 'heading',
    GridFeatures = 'grid-features',
}

export enum VideoQuality {
    Q1080p = '1080p',
    Q4k = '4k',
}

// Toast Enums
export enum ToastType {
    Success = 'success',
    Error = 'error',
    Info = 'info',
    Warning = 'warning',
}
