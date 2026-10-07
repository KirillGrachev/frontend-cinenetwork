import { AnimeGenre, AnimeType } from '../types/enums';
import { Anime, AnimeDetails, BannerItem, NewsItem, Collection, CharacterDetails, Review, SimpleComment, Voiceover, Character, Episode } from '../types/interfaces';
import { 
    AnimeDTO, 
    AnimeDetailsDTO, 
    BannerItemDTO, 
    NewsItemDTO, 
    CollectionDTO,
    ReviewDTO,
    SimpleCommentDTO,
    VoiceoverDTO,
    CharacterDTO,
    EpisodeDTO
} from '../types/dtos';

/**
 * Maps raw API DTO to internal domain Anime model.
 */
export const mapAnimeDtoToDomain = (dto: AnimeDTO): Anime => {
    return {
        id: dto.id,
        title: dto.title || '',
        description: dto.description || '',
        thumbnailUrl: dto.thumbnail_url || dto.thumbnailUrl || '/assets/placeholder-cover.jpeg',
        coverUrl: dto.cover_url || dto.coverUrl || '/assets/placeholder-cover.jpeg',
        rating: dto.rating_float ?? dto.rating ?? 0,
        genres: (dto.genres || []).map(g => g as AnimeGenre),
        year: dto.release_year ?? dto.year ?? new Date().getFullYear(),
        studio: dto.studio_name || dto.studio,
        type: (dto.type_code as AnimeType) || dto.type || AnimeType.TV
    };
};

export const mapVoiceoverDtoToDomain = (dto: VoiceoverDTO): Voiceover => {
    return {
        id: dto.id,
        name: dto.name,
        language: dto.language as any,
        author: dto.author
    };
};

export const mapSimpleCommentDtoToDomain = (dto: SimpleCommentDTO): SimpleComment => {
    return {
        id: dto.id,
        userId: dto.user_id || dto.userId || '',
        username: dto.username,
        avatarUrl: dto.avatar_url || dto.avatarUrl,
        content: dto.content,
        date: dto.date,
        likes: dto.likes ?? 0
    };
};

export const mapCharacterDtoToDomain = (dto: CharacterDTO): Character => {
    return {
        id: dto.id,
        name: dto.name,
        role: (dto.role as any) || 'Supporting',
        imageUrl: dto.image_url || dto.imageUrl || ''
    };
};

export const mapReviewDtoToDomain = (dto: ReviewDTO): Review => {
    return {
        id: dto.id,
        userId: dto.user_id || dto.userId || '',
        username: dto.username,
        avatarUrl: dto.avatar_url || dto.avatarUrl,
        rating: dto.rating,
        date: dto.date,
        content: dto.content,
        likes: dto.likes,
        isSpoiler: dto.is_spoiler ?? dto.isSpoiler ?? false
    };
};

export const mapEpisodeDtoToDomain = (dto: EpisodeDTO): Episode => {
    return {
        id: dto.id,
        number: dto.number,
        title: dto.title,
        image: dto.image,
        duration: dto.duration,
        airDate: dto.air_date || dto.airDate
    };
};

/**
 * Maps raw API DTO to internal domain AnimeDetails model.
 */
export const mapAnimeDetailsDtoToDomain = (dto: AnimeDetailsDTO): AnimeDetails => {
    const baseAnime = mapAnimeDtoToDomain(dto);
    return {
        ...baseAnime,
        originalTitle: dto.original_title || dto.originalTitle || baseAnime.title,
        status: (dto.status_code as any) || dto.status || 'released',
        duration: dto.episode_duration || dto.duration || '24',
        source: (dto.source_type as any) || dto.source || 'manga',
        ageRating: dto.age_rating || dto.ageRating || '16+',
        episodesCount: dto.episodes_count ?? dto.episodesCount ?? 12,
        screenshots: dto.screenshot_urls || dto.screenshots || [],
        voiceovers: (dto.voiceovers_data || []).map(mapVoiceoverDtoToDomain),
        comments: (dto.comments_data || []).map(mapSimpleCommentDtoToDomain),
        characters: (dto.characters_data || []).map(mapCharacterDtoToDomain),
        staff: dto.staff_data || [],
        videos: dto.videos_data || [],
        similars: (dto.similars_data || []).map(mapAnimeDtoToDomain),
        reviews: (dto.reviews_data || []).map(mapReviewDtoToDomain),
        episodesList: (dto.episodes_data || []).map(mapEpisodeDtoToDomain)
    };
};

// --- Reverse Mappers (Domain -> DTO) ---

export const mapReviewDomainToDto = (domain: Review): ReviewDTO => {
    return {
        id: domain.id,
        user_id: domain.userId,
        username: domain.username,
        avatar_url: domain.avatarUrl,
        rating: domain.rating,
        date: domain.date,
        content: domain.content,
        likes: domain.likes,
        is_spoiler: domain.isSpoiler
    };
};

export const mapSimpleCommentDomainToDto = (domain: SimpleComment): SimpleCommentDTO => {
    return {
        id: domain.id,
        user_id: domain.userId,
        username: domain.username,
        avatar_url: domain.avatarUrl,
        content: domain.content,
        date: domain.date,
        likes: domain.likes
    };
};

export const mapAnimeDomainToDto = (domain: Anime): AnimeDTO => {
    return {
        id: domain.id,
        title: domain.title,
        description: domain.description,
        thumbnail_url: domain.thumbnailUrl,
        cover_url: domain.coverUrl,
        rating_float: domain.rating,
        genres: domain.genres.map(g => String(g)),
        release_year: domain.year,
        studio_name: domain.studio,
        type_code: domain.type
    };
};

/**
 * Maps raw API Banner DTO to domain BannerItem model.
 */
export const mapBannerDtoToDomain = (dto: BannerItemDTO): BannerItem => {
    return {
        id: dto.id,
        title: dto.title,
        subtitle: dto.subtitle,
        backgroundUrl: dto.background_url || dto.backgroundUrl || '',
        link: dto.link_url || dto.link || '/',
        buttonText: dto.button_text || dto.buttonText || 'common.watchNow'
    };
};

/**
 * Maps raw API News DTO to domain NewsItem model.
 */
export const mapNewsDtoToDomain = (dto: NewsItemDTO): NewsItem => {
    return {
        id: dto.id,
        title: dto.title,
        excerpt: dto.excerpt_text || dto.excerpt || '',
        date: dto.published_date || dto.date || new Date().toISOString(),
        imageUrl: dto.banner_image || dto.imageUrl || '',
        category: dto.category_name || dto.category || 'Anime',
        readTime: dto.read_time_minutes || dto.readTime || '3 min'
    };
};

/**
 * Maps raw API Collection DTO to domain Collection model.
 */
export const mapCollectionDtoToDomain = (dto: CollectionDTO): Collection => {
    return {
        id: dto.id,
        title: dto.title,
        count: dto.items_count ?? dto.count ?? 0,
        image: dto.cover_image || dto.image || '',
        color: dto.badge_color || dto.color || 'blue'
    };
};
