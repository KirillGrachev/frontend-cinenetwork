import { 
    IAnimeDataProvider, 
    INewsDataProvider, 
    ICollectionDataProvider, 
    IUserDataProvider, 
    IAdminDataProvider,
    IStatusDataProvider
} from './types';
import { 
    MockAnimeProvider, 
    MockNewsProvider, 
    MockCollectionProvider, 
    MockUserProvider, 
    MockAdminProvider, 
    MockStatusProvider 
} from './mockProvider';
import { 
    mapAnimeDtoToDomain, 
    mapAnimeDetailsDtoToDomain, 
    mapBannerDtoToDomain, 
    mapNewsDtoToDomain, 
    mapCollectionDtoToDomain 
} from '../../mappers/animeMapper';
import { AnimeDTO, AnimeDetailsDTO, BannerItemDTO, NewsItemDTO, CollectionDTO } from '../../types/dtos';

/**
 * ApiProvider implements real HTTP REST API communication with fallback to MockProvider if endpoint is unavailable.
 * Uses DTO mappers to safely isolate API schema changes from internal application domain models.
 */
export class ApiAnimeProvider implements IAnimeDataProvider {
    private mockFallback = new MockAnimeProvider();

    private async fetchAndMap<DTO, Domain>(
        url: string, 
        mapper: (dto: DTO) => Domain, 
        fallbackFn: () => Promise<Domain>
    ): Promise<Domain> {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: DTO = await res.json();
            return mapper(data);
        } catch (err) {
            return fallbackFn();
        }
    }

    private async fetchAndMapList<DTO, Domain>(
        url: string, 
        mapper: (dto: DTO) => Domain, 
        fallbackFn: () => Promise<Domain[]>
    ): Promise<Domain[]> {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: DTO[] = await res.json();
            return data.map(mapper);
        } catch (err) {
            return fallbackFn();
        }
    }

    getFeaturedAnime() { 
        return this.fetchAndMap<AnimeDTO, Anime>('/api/anime/featured', mapAnimeDtoToDomain, () => this.mockFallback.getFeaturedAnime()); 
    }
    
    getNewReleases() { 
        return this.fetchAndMapList<AnimeDTO, Anime>('/api/anime/new', mapAnimeDtoToDomain, () => this.mockFallback.getNewReleases()); 
    }
    
    getTrendingAnime() { 
        return this.fetchAndMapList<AnimeDTO, Anime>('/api/anime/trending', mapAnimeDtoToDomain, () => this.mockFallback.getTrendingAnime()); 
    }
    
    getFullCatalog() { 
        return this.fetchAndMapList<AnimeDTO, Anime>('/api/anime/catalog', mapAnimeDtoToDomain, () => this.mockFallback.getFullCatalog()); 
    }
    
    getHomeBanners() { 
        return this.fetchAndMapList<BannerItemDTO, BannerItem>('/api/banners', mapBannerDtoToDomain, () => this.mockFallback.getHomeBanners()); 
    }
    
    getFavorites() { 
        return this.fetchAndMapList<AnimeDTO, Anime>('/api/anime/favorites', mapAnimeDtoToDomain, () => this.mockFallback.getFavorites()); 
    }
    
    getAnimeDetails(id: number) { 
        return this.fetchAndMap<AnimeDetailsDTO, AnimeDetails>(`/api/anime/${id}`, mapAnimeDetailsDtoToDomain, () => this.mockFallback.getAnimeDetails(id)); 
    }
    
    getCharacterDetails(id: number) { 
        return this.mockFallback.getCharacterDetails(id); 
    }
    
    getStudioAnime(studioName: string) { 
        return this.fetchAndMapList<AnimeDTO, Anime>(`/api/studio/${encodeURIComponent(studioName)}`, mapAnimeDtoToDomain, () => this.mockFallback.getStudioAnime(studioName)); 
    }

    search(query: string, filters?: any) {
        const queryParams = new URLSearchParams();
        if (query) queryParams.append('q', query);
        if (filters) {
            if (filters.genre) queryParams.append('genre', filters.genre);
            if (filters.year) queryParams.append('year', filters.year);
            if (filters.studio) queryParams.append('studio', filters.studio);
        }
        const qs = queryParams.toString();
        const url = qs ? `/api/search?${qs}` : '/api/search';
        return this.fetchAndMapList<AnimeDTO, Anime>(url, mapAnimeDtoToDomain, () => this.mockFallback.search(query, filters));
    }
}

export class ApiNewsProvider implements INewsDataProvider {
    private mockFallback = new MockNewsProvider();
    getNewsItems() { return this.mockFallback.getNewsItems(); }
    getNewsItemById(id: number) { return this.mockFallback.getNewsItemById(id); }
}

export class ApiCollectionProvider implements ICollectionDataProvider {
    private mockFallback = new MockCollectionProvider();
    getCollections() { return this.mockFallback.getCollections(); }
    getCollectionById(id: number) { return this.mockFallback.getCollectionById(id); }
    getAnimeByCollectionId(id: number) { return this.mockFallback.getAnimeByCollectionId(id); }
    getCuratorsByCollectionId(id: number) { return this.mockFallback.getCuratorsByCollectionId(id); }
}

export class ApiUserProvider implements IUserDataProvider {
    private mockFallback = new MockUserProvider();
    getUserSettings() { return this.mockFallback.getUserSettings(); }
    getUserProfile(id?: string | number) { return this.mockFallback.getUserProfile(id); }
}

export class ApiAdminProvider implements IAdminDataProvider {
    private mockFallback = new MockAdminProvider();
    getStats(period: any) { return this.mockFallback.getStats(period); }
    getUsers() { return this.mockFallback.getUsers(); }
    getComments() { return this.mockFallback.getComments(); }
    getActivityLogs() { return this.mockFallback.getActivityLogs(); }
}

export class ApiStatusProvider implements IStatusDataProvider {
    private mockFallback = new MockStatusProvider();
    getIncidents() { return this.mockFallback.getIncidents(); }
}
