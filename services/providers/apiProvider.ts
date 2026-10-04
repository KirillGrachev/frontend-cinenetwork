import type {
    IAdminDataProvider,
    IAnimeDataProvider,
    IAuthDataProvider,
    ICollectionDataProvider,
    INewsDataProvider,
    INotificationDataProvider,
    IStatusDataProvider,
    IUserDataProvider,
} from './types';
import {
    mapAnimeDetailsDtoToDomain,
    mapAnimeDtoToDomain,
    mapBannerDtoToDomain,
    mapCollectionDtoToDomain,
    mapNewsDtoToDomain,
    mapNotificationDtoToDomain,
    mapUserProfileDtoToDomain,
} from '../../mappers/animeMapper';
import type {
    AdminSection,
    AdminStats,
    AdminUser,
    Anime,
    AnimeDetails,
    AnimeDetailsDTO,
    AnimeDTO,
    AuthCredentials,
    AuthSession,
    BannerItem,
    BannerItemDTO,
    CharacterDetails,
    Collection,
    CollectionDTO,
    Comment,
    Curator,
    Incident,
    LogEntry,
    NewsItem,
    NewsItemDTO,
    Notification,
    NotificationDTO,
    SearchFilters,
    ServiceGroup,
    UserProfileDTO,
    UserProfileData,
    UserSettings,
} from '../../types';
import type { AdminPeriod } from '../../types';
import { httpGetJson, httpPostJson, withQuery } from '../httpClient';
import { MockAnimeProvider } from './mockProvider';

/**
 * REST implementations of the data-provider contracts.
 *
 * Instantiated only when `VITE_API_ENABLED === 'true'` (providerFactory).
 * Failures propagate as `ApiError` — retry policy belongs to React Query,
 * error UI belongs to components. There is intentionally NO silent fallback
 * to mock data: it would mask backend outages.
 *
 * The only remaining mock delegation is `getCharacterDetails` — the
 * characters endpoint does not exist on the backend yet (TODO(backend)),
 * tracked explicitly rather than hidden behind a blanket catch.
 *
 * Response contracts for admin/user/status domains are the domain types in
 * `types/` verbatim (backend contract v1, camelCase). When the real backend
 * is finalised, add zod validation at this boundary.
 */

export class ApiAnimeProvider implements IAnimeDataProvider {
    /** TODO(backend): no /api/character endpoint yet. */
    private readonly mock = new MockAnimeProvider();

    async getFeaturedAnime(): Promise<Anime> {
        const dto = await httpGetJson<AnimeDTO>('/api/anime/featured');
        return mapAnimeDtoToDomain(dto);
    }

    async getNewReleases(): Promise<Anime[]> {
        const dtos = await httpGetJson<AnimeDTO[]>('/api/anime/new');
        return dtos.map(mapAnimeDtoToDomain);
    }

    async getTrendingAnime(): Promise<Anime[]> {
        const dtos = await httpGetJson<AnimeDTO[]>('/api/anime/trending');
        return dtos.map(mapAnimeDtoToDomain);
    }

    async getFullCatalog(): Promise<Anime[]> {
        const dtos = await httpGetJson<AnimeDTO[]>('/api/anime/catalog');
        return dtos.map(mapAnimeDtoToDomain);
    }

    async getHomeBanners(): Promise<BannerItem[]> {
        const dtos = await httpGetJson<BannerItemDTO[]>('/api/banners');
        return dtos.map(mapBannerDtoToDomain);
    }

    async getFavorites(): Promise<Anime[]> {
        const dtos = await httpGetJson<AnimeDTO[]>('/api/anime/favorites');
        return dtos.map(mapAnimeDtoToDomain);
    }

    async getAnimeDetails(id: number): Promise<AnimeDetails | undefined> {
        const dto = await httpGetJson<AnimeDetailsDTO>(`/api/anime/${id}`);
        return mapAnimeDetailsDtoToDomain(dto);
    }

    getCharacterDetails(id: number): Promise<CharacterDetails | undefined> {
        return this.mock.getCharacterDetails(id);
    }

    async getStudioAnime(studioName: string): Promise<Anime[]> {
        const dtos = await httpGetJson<AnimeDTO[]>(`/api/studio/${encodeURIComponent(studioName)}`);
        return dtos.map(mapAnimeDtoToDomain);
    }

    async search(query: string, filters?: SearchFilters): Promise<Anime[]> {
        const path = withQuery('/api/search', {
            q: query,
            genre: filters?.genre,
            year: filters?.year,
            studio: filters?.studio,
        });
        const dtos = await httpGetJson<AnimeDTO[]>(path);
        return dtos.map(mapAnimeDtoToDomain);
    }
}

export class ApiNewsProvider implements INewsDataProvider {
    async getNewsItems(): Promise<NewsItem[]> {
        const dtos = await httpGetJson<NewsItemDTO[]>('/api/news');
        return dtos.map(mapNewsDtoToDomain);
    }

    async getNewsItemById(id: number): Promise<NewsItem | undefined> {
        const dto = await httpGetJson<NewsItemDTO | null>(`/api/news/${id}`);
        return dto ? mapNewsDtoToDomain(dto) : undefined;
    }
}

export class ApiCollectionProvider implements ICollectionDataProvider {
    async getCollections(): Promise<Collection[]> {
        const dtos = await httpGetJson<CollectionDTO[]>('/api/collections');
        return dtos.map(mapCollectionDtoToDomain);
    }

    async getCollectionById(id: number): Promise<Collection | undefined> {
        const dto = await httpGetJson<CollectionDTO | null>(`/api/collections/${id}`);
        return dto ? mapCollectionDtoToDomain(dto) : undefined;
    }

    async getAnimeByCollectionId(id: number): Promise<Anime[]> {
        const dtos = await httpGetJson<AnimeDTO[]>(`/api/collections/${id}/anime`);
        return dtos.map(mapAnimeDtoToDomain);
    }

    async getCuratorsByCollectionId(id: number): Promise<Curator[]> {
        return httpGetJson<Curator[]>(`/api/collections/${id}/curators`);
    }
}

export class ApiUserProvider implements IUserDataProvider {
    async getUserSettings(): Promise<UserSettings> {
        const dto = await httpGetJson<UserProfileDTO>('/api/user/settings');
        return mapUserProfileDtoToDomain(dto);
    }

    async getUserProfile(id?: string | number): Promise<UserProfileData> {
        const dto = await httpGetJson<UserProfileDTO>(`/api/users/${id ?? 'me'}`);
        return mapUserProfileDtoToDomain(dto);
    }
}

export class ApiNotificationProvider implements INotificationDataProvider {
    async getNotifications(): Promise<Notification[]> {
        const dtos = await httpGetJson<NotificationDTO[]>('/api/notifications');
        return dtos.map(mapNotificationDtoToDomain);
    }
}

export class ApiAdminProvider implements IAdminDataProvider {
    getStats(period: AdminPeriod): Promise<AdminStats> {
        return httpGetJson<AdminStats>(withQuery('/api/admin/stats', { period }));
    }

    getUsers(): Promise<AdminUser[]> {
        return httpGetJson<AdminUser[]>('/api/admin/users');
    }

    getComments(section: AdminSection): Promise<Comment[]> {
        return httpGetJson<Comment[]>(withQuery('/api/admin/comments', { section }));
    }

    getActivityLogs(): Promise<LogEntry[]> {
        return httpGetJson<LogEntry[]>('/api/admin/activity');
    }
}

export class ApiStatusProvider implements IStatusDataProvider {
    getIncidents(): Promise<Incident[]> {
        return httpGetJson<Incident[]>('/api/status/incidents');
    }

    getSystemStatus(): Promise<ServiceGroup[]> {
        return httpGetJson<ServiceGroup[]>('/api/status/system');
    }
}

interface AuthSessionDTO {
    token: string;
    user: UserProfileDTO;
}

export class ApiAuthProvider implements IAuthDataProvider {
    async login(credentials: AuthCredentials): Promise<AuthSession> {
        const dto = await httpPostJson<AuthSessionDTO>('/api/auth/login', credentials);
        return { token: dto.token, user: mapUserProfileDtoToDomain(dto.user) };
    }

    async logout(): Promise<void> {
        await httpPostJson<void>('/api/auth/logout');
    }

    async getCurrentUser(): Promise<UserProfileData> {
        const dto = await httpGetJson<UserProfileDTO>('/api/auth/me');
        return mapUserProfileDtoToDomain(dto);
    }
}
