import { AnimeGenre, AnimeType, ContentType, UserRole, VideoQuality } from '../types/enums';
import type {
    Achievement,
    Anime,
    AnimeDetails,
    BannerItem,
    Character,
    ContentBlock,
    Episode,
    NewsItem,
    Notification,
    Collection,
    ProfileActivityItem,
    ProfileStats,
    Review,
    SimpleComment,
    UserProfileData,
    Voiceover,
} from '../types/interfaces';
import type {
    AnimeDTO,
    AnimeDetailsDTO,
    BannerItemDTO,
    CharacterDTO,
    CollectionDTO,
    ContentBlockDTO,
    EpisodeDTO,
    NewsItemDTO,
    NotificationDTO,
    ReviewDTO,
    SimpleCommentDTO,
    UserProfileDTO,
    VoiceoverDTO,
} from '../types/dtos';

/**
 * DTO → Domain mappers.
 *
 * This module is the *only* place where the external API schema is allowed to
 * leak into the application. Every mapper is total: it never throws and
 * always produces a valid domain object, falling back to safe defaults for
 * missing/unknown values instead of `as any` casts.
 */

const PLACEHOLDER_IMAGE = '/assets/placeholder-cover.jpeg';

const VOICEOVER_LANGUAGES = ['ru', 'en', 'jp', 'other'] as const;
const CHARACTER_ROLES = ['Main', 'Supporting'] as const;
const ANIME_STATUSES = ['ongoing', 'released', 'announced'] as const;

function parseEnum<T extends string>(
    value: string | undefined,
    allowed: readonly T[],
    fallback: T,
): T {
    return allowed.includes(value as T) ? (value as T) : fallback;
}

function isGenre(value: string): value is AnimeGenre {
    return (Object.values(AnimeGenre) as string[]).includes(value);
}

export const mapAnimeDtoToDomain = (dto: AnimeDTO): Anime => ({
    id: dto.id,
    title: dto.title ?? '',
    description: dto.description ?? '',
    thumbnailUrl: dto.thumbnail_url ?? dto.thumbnailUrl ?? PLACEHOLDER_IMAGE,
    coverUrl: dto.cover_url ?? dto.coverUrl ?? PLACEHOLDER_IMAGE,
    rating: dto.rating_float ?? dto.rating ?? 0,
    genres: (dto.genres ?? []).filter(isGenre),
    year: dto.release_year ?? dto.year ?? new Date().getFullYear(),
    studio: dto.studio_name ?? dto.studio,
    type: parseEnum(dto.type_code ?? dto.type, Object.values(AnimeType), AnimeType.TV),
});

export const mapVoiceoverDtoToDomain = (dto: VoiceoverDTO): Voiceover => ({
    id: dto.id,
    name: dto.name,
    language: parseEnum(dto.language, VOICEOVER_LANGUAGES, 'other'),
    author: dto.author,
});

export const mapSimpleCommentDtoToDomain = (dto: SimpleCommentDTO): SimpleComment => ({
    id: dto.id,
    userId: dto.user_id ?? dto.userId ?? '',
    username: dto.username,
    avatarUrl: dto.avatar_url ?? dto.avatarUrl,
    content: dto.content,
    date: dto.date,
    likes: dto.likes ?? 0,
});

export const mapCharacterDtoToDomain = (dto: CharacterDTO): Character => ({
    id: dto.id,
    name: dto.name,
    role: parseEnum(dto.role, CHARACTER_ROLES, 'Supporting'),
    imageUrl: dto.image_url ?? dto.imageUrl ?? '',
});

export const mapReviewDtoToDomain = (dto: ReviewDTO): Review => ({
    id: dto.id,
    userId: dto.user_id ?? dto.userId ?? '',
    username: dto.username,
    avatarUrl: dto.avatar_url ?? dto.avatarUrl,
    rating: dto.rating,
    date: dto.date,
    content: dto.content,
    likes: dto.likes,
    isSpoiler: dto.is_spoiler ?? dto.isSpoiler ?? false,
});

export const mapEpisodeDtoToDomain = (dto: EpisodeDTO): Episode => ({
    id: dto.id,
    number: dto.number,
    title: dto.title,
    image: dto.image,
    duration: dto.duration,
    airDate: dto.air_date ?? dto.airDate,
});

export const mapAnimeDetailsDtoToDomain = (dto: AnimeDetailsDTO): AnimeDetails => {
    const baseAnime = mapAnimeDtoToDomain(dto);
    return {
        ...baseAnime,
        originalTitle: dto.original_title ?? dto.originalTitle ?? baseAnime.title,
        status: parseEnum(dto.status_code ?? dto.status, ANIME_STATUSES, 'released'),
        duration: dto.episode_duration ?? dto.duration ?? '24',
        source: dto.source_type ?? dto.source ?? 'manga',
        ageRating: dto.age_rating ?? dto.ageRating ?? '16+',
        episodesCount: dto.episodes_count ?? dto.episodesCount ?? 12,
        screenshots: dto.screenshot_urls ?? dto.screenshots ?? [],
        voiceovers: (dto.voiceovers_data ?? []).map(mapVoiceoverDtoToDomain),
        comments: (dto.comments_data ?? []).map(mapSimpleCommentDtoToDomain),
        characters: (dto.characters_data ?? []).map(mapCharacterDtoToDomain),
        similar: (dto.similars_data ?? []).map(mapAnimeDtoToDomain),
        reviews: (dto.reviews_data ?? []).map(mapReviewDtoToDomain),
        episodesList: (dto.episodes_data ?? []).map(mapEpisodeDtoToDomain),
    };
};

export const mapBannerDtoToDomain = (dto: BannerItemDTO): BannerItem => ({
    id: dto.id,
    imageUrl: dto.image_url ?? dto.imageUrl ?? PLACEHOLDER_IMAGE,
    alt: dto.alt ?? '',
    link: dto.link_url ?? dto.link,
});

const CONTENT_BLOCK_TYPES = Object.values(ContentType);

export const mapContentBlockDtoToDomain = (dto: ContentBlockDTO): ContentBlock => ({
    type: parseEnum(dto.type, CONTENT_BLOCK_TYPES, ContentType.Paragraph),
    content: dto.content,
    items: dto.items,
});

export const mapNewsDtoToDomain = (dto: NewsItemDTO): NewsItem => {
    const blocks = dto.content_blocks ?? dto.contentBlocks;
    return {
        id: dto.id,
        title: dto.title,
        excerpt: dto.excerpt_text ?? dto.excerpt ?? '',
        date: dto.published_date ?? dto.date ?? new Date().toISOString(),
        readTime: dto.read_time_minutes ?? dto.readTime ?? '3 min',
        tags: dto.tags ?? [],
        isFeatured: dto.is_featured ?? dto.isFeatured ?? false,
        contentBlocks: blocks?.map(mapContentBlockDtoToDomain),
        toc: dto.toc,
    };
};

const NOTIFICATION_TYPES = ['system', 'like', 'comment', 'release'] as const;

export const mapNotificationDtoToDomain = (dto: NotificationDTO): Notification => ({
    id: dto.id,
    title: dto.title,
    description: dto.description,
    time: dto.time,
    isRead: dto.is_read ?? dto.isRead ?? false,
    type: parseEnum(dto.type, NOTIFICATION_TYPES, 'system'),
    image: dto.image,
    link: dto.link,
});

const DEFAULT_PREFERENCES = {
    autoplay: true,
    quality: VideoQuality.Q1080p,
    notifications: true,
};

const DEFAULT_STATS: ProfileStats = {
    totalWatchedEpisodes: 0,
    totalTitles: 0,
    daysWatched: 0,
    commentsCount: 0,
    reviewsCount: 0,
    averageScore: 0,
};

export const mapUserProfileDtoToDomain = (dto: UserProfileDTO): UserProfileData => ({
    id: dto.id,
    username: dto.username,
    email: dto.email,
    avatarUrl: dto.avatar_url ?? dto.avatarUrl,
    isPremium: dto.is_premium ?? dto.isPremium ?? false,
    role: dto.role ?? UserRole.User,
    preferences: { ...DEFAULT_PREFERENCES, ...dto.preferences },
    joinDate: dto.join_date ?? dto.joinDate ?? new Date(0).toISOString(),
    coverUrl: dto.cover_url ?? dto.coverUrl,
    level: dto.level ?? 1,
    xp: dto.xp ?? 0,
    nextLevelXp: dto.nextLevelXp ?? dto.next_level_xp ?? 1000,
    bio: dto.bio,
    stats: dto.stats ?? DEFAULT_STATS,
    viewingDynamics: dto.viewingDynamics ?? dto.viewing_dynamics ?? [],
    achievements: (dto.achievements ?? []) as Achievement[],
    recentActivity: (dto.recentActivity ?? dto.recent_activity ?? []) as ProfileActivityItem[],
    friends: dto.friends ?? [],
    collections: dto.collections ?? [],
    ratedAnime: dto.ratedAnime ?? dto.rated_anime ?? [],
    comments: dto.comments ?? [],
});

export const mapCollectionDtoToDomain = (dto: CollectionDTO): Collection => ({
    id: dto.id,
    title: dto.title,
    count: dto.items_count ?? dto.count ?? 0,
    image: dto.cover_image ?? dto.image ?? '',
    color: dto.badge_color ?? dto.color ?? 'blue',
});
