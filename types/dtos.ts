import type { AnimeType, UserRole, VideoQuality } from './enums';
import type { Achievement, Collection, ProfileActivityItem, ProfileStats } from './interfaces';

/**
 * Data Transfer Objects — raw shapes as they come from the backend.
 *
 * Rules:
 *  1. A DTO describes the *external* contract only. Domain models live in
 *     `interfaces.ts` and are produced from DTOs exclusively by the mappers
 *     in `mappers/`.
 *  2. Optional camelCase aliases exist because the demo backend is not
 *     finalised on a casing convention; mappers normalise both variants.
 *  3. Every DTO field must be consumed by a mapper. Dead fields are removed.
 */

export interface AnimeDTO {
    id: number;
    title: string;
    description: string;
    thumbnail_url?: string;
    thumbnailUrl?: string;
    cover_url?: string;
    coverUrl?: string;
    rating_float?: number;
    rating?: number;
    genres?: string[];
    release_year?: number;
    year?: number;
    studio_name?: string;
    studio?: string;
    type_code?: string;
    type?: AnimeType;
}

export interface CharacterDTO {
    id: number;
    name: string;
    role: string;
    image_url?: string;
    imageUrl?: string;
}

export interface VoiceoverDTO {
    id: string;
    name: string;
    language: string;
    author?: string;
}

export interface SimpleCommentDTO {
    id: number;
    user_id?: string;
    userId?: string;
    username: string;
    avatar_url?: string;
    avatarUrl?: string;
    content: string;
    date: string;
    likes?: number;
}

export interface ReviewDTO {
    id: number;
    user_id?: string;
    userId?: string;
    username: string;
    avatar_url?: string;
    avatarUrl?: string;
    rating: number;
    date: string;
    content: string;
    likes: number;
    is_spoiler?: boolean;
    isSpoiler?: boolean;
}

export interface EpisodeDTO {
    id: number;
    number: number;
    title: string;
    image: string;
    duration: string;
    air_date?: string;
    airDate?: string;
}

export interface AnimeDetailsDTO extends AnimeDTO {
    original_title?: string;
    originalTitle?: string;
    status_code?: string;
    status?: string;
    episode_duration?: string;
    duration?: string;
    source_type?: string;
    source?: string;
    age_rating?: string;
    ageRating?: string;
    episodes_count?: number;
    episodesCount?: number;
    screenshot_urls?: string[];
    screenshots?: string[];
    voiceovers_data?: VoiceoverDTO[];
    comments_data?: SimpleCommentDTO[];
    characters_data?: CharacterDTO[];
    similars_data?: AnimeDTO[];
    reviews_data?: ReviewDTO[];
    episodes_data?: EpisodeDTO[];
}

export interface BannerItemDTO {
    id: number;
    image_url?: string;
    imageUrl?: string;
    alt?: string;
    link_url?: string;
    link?: string;
}

export interface NewsItemDTO {
    id: number;
    title: string;
    excerpt_text?: string;
    excerpt?: string;
    published_date?: string;
    date?: string;
    read_time_minutes?: string;
    readTime?: string;
    tags?: string[];
    is_featured?: boolean;
    isFeatured?: boolean;
    /** Full-post payload (blog page). */
    content_blocks?: ContentBlockDTO[];
    contentBlocks?: ContentBlockDTO[];
    toc?: string[];
}

export interface ContentBlockDTO {
    type: string;
    content?: string;
    items?: { title: string; subtitle: string; desc: string; color: string }[];
}

export interface NotificationDTO {
    id: number;
    title: string;
    description: string;
    time: string;
    is_read?: boolean;
    isRead?: boolean;
    type: string;
    image?: string;
    link?: string;
}

/**
 * User profile as returned by /api/users/:id and /api/auth/*.
 * Contract v1: camelCase domain shape with snake_case aliases for the flat
 * fields most backend frameworks emit by default. Nested structures follow
 * the domain types verbatim.
 */
export interface UserProfileDTO {
    id: number | string;
    username: string;
    email: string;
    avatar_url?: string;
    avatarUrl?: string;
    is_premium?: boolean;
    isPremium?: boolean;
    role?: UserRole;
    preferences?: { autoplay?: boolean; quality?: VideoQuality; notifications?: boolean };
    join_date?: string;
    joinDate?: string;
    cover_url?: string;
    coverUrl?: string;
    level?: number;
    xp?: number;
    next_level_xp?: number;
    nextLevelXp?: number;
    bio?: string;
    stats?: ProfileStats;
    viewing_dynamics?: number[];
    viewingDynamics?: number[];
    achievements?: Achievement[];
    recent_activity?: ProfileActivityItem[];
    recentActivity?: ProfileActivityItem[];
    friends?: { id: string; username: string; avatarUrl?: string; level: number }[];
    collections?: Collection[];
    rated_anime?: { id: number; title: string; image: string; rating: number }[];
    ratedAnime?: { id: number; title: string; image: string; rating: number }[];
    comments?: { id: number; animeTitle: string; content: string; date: string }[];
}

export interface CollectionDTO {
    id: number;
    title: string;
    items_count?: number;
    count?: number;
    cover_image?: string;
    image?: string;
    badge_color?: string;
    color?: string;
}
