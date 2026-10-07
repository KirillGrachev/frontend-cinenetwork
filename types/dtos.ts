import { AnimeGenre, AnimeType } from './enums';

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
    genres: string[];
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
    staff_data?: any[];
    videos_data?: any[];
    similars_data?: AnimeDTO[];
    reviews_data?: ReviewDTO[];
    episodes_data?: EpisodeDTO[];
}

export interface BannerItemDTO {
    id: number;
    title: string;
    subtitle: string;
    background_url?: string;
    backgroundUrl?: string;
    link_url?: string;
    link?: string;
    button_text?: string;
    buttonText?: string;
}

export interface NewsItemDTO {
    id: number;
    title: string;
    excerpt_text?: string;
    excerpt?: string;
    published_date?: string;
    date?: string;
    banner_image?: string;
    imageUrl?: string;
    category_name?: string;
    category?: string;
    read_time_minutes?: string;
    readTime?: string;
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
