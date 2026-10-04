import type {
    IAnimeService,
    Anime,
    AnimeDetails,
    BannerItem,
    CharacterDetails,
    SearchFilters,
} from '../types';
import type { IAnimeDataProvider } from './providers/types';
import { getAnimeDataProvider } from './providers/providerFactory';

/**
 * Thin application-facing wrapper over the anime data provider.
 *
 * Caching/staleness is owned exclusively by React Query (see hooks), so
 * services deliberately contain no caching logic — the former
 * `BaseService.cachedRequest` was a pass-through with an ignored key.
 * The provider is injectable for tests.
 */
export class AnimeService implements IAnimeService {
    constructor(private readonly provider: IAnimeDataProvider = getAnimeDataProvider()) {}

    getFeaturedAnime = (): Promise<Anime> => {
        return this.provider.getFeaturedAnime();
    };

    getNewReleases = (): Promise<Anime[]> => {
        return this.provider.getNewReleases();
    };

    getTrendingAnime = (): Promise<Anime[]> => {
        return this.provider.getTrendingAnime();
    };

    getFullCatalog = (): Promise<Anime[]> => {
        return this.provider.getFullCatalog();
    };

    getHomeBanners = (): Promise<BannerItem[]> => {
        return this.provider.getHomeBanners();
    };

    getFavorites = (): Promise<Anime[]> => {
        return this.provider.getFavorites();
    };

    getAnimeDetails = (id: number): Promise<AnimeDetails | undefined> => {
        return this.provider.getAnimeDetails(id);
    };

    getCharacterDetails = (id: number): Promise<CharacterDetails | undefined> => {
        return this.provider.getCharacterDetails(id);
    };

    getStudioAnime = (studioName: string): Promise<Anime[]> => {
        return this.provider.getStudioAnime(studioName);
    };

    search = (query: string, filters?: SearchFilters): Promise<Anime[]> => {
        return this.provider.search(query, filters);
    };
}
