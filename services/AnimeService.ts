import { BaseService } from './BaseService';
import { IAnimeService, Anime, BannerItem, SearchFilters, AnimeDetails, CharacterDetails } from '../types';
import { IAnimeDataProvider } from './providers/types';
import { getAnimeDataProvider } from './providers/providerFactory';

export class AnimeService extends BaseService implements IAnimeService {
  constructor(private provider: IAnimeDataProvider = getAnimeDataProvider()) {
    super();
  }
  
  getFeaturedAnime = (): Promise<Anime> => {
    return this.cachedRequest('featuredAnime', () => this.provider.getFeaturedAnime());
  }

  getNewReleases = (): Promise<Anime[]> => {
    return this.cachedRequest('newReleases', () => this.provider.getNewReleases());
  }

  getTrendingAnime = (): Promise<Anime[]> => {
    return this.cachedRequest('trendingAnime', () => this.provider.getTrendingAnime());
  }

  getFullCatalog = (): Promise<Anime[]> => {
    return this.cachedRequest('fullCatalog', () => this.provider.getFullCatalog());
  }

  getHomeBanners = (): Promise<BannerItem[]> => {
    return this.cachedRequest('homeBanners', () => this.provider.getHomeBanners());
  }

  getFavorites = (): Promise<Anime[]> => {
    return this.cachedRequest('favorites', () => this.provider.getFavorites());
  }

  getAnimeDetails = (id: number): Promise<AnimeDetails | undefined> => {
    return this.cachedRequest(`anime_details_${id}`, () => this.provider.getAnimeDetails(id));
  }

  getCharacterDetails = (id: number): Promise<CharacterDetails | undefined> => {
    return this.cachedRequest(`character_details_${id}`, () => this.provider.getCharacterDetails(id));
  }

  getStudioAnime = (studioName: string): Promise<Anime[]> => {
    return this.cachedRequest(`studio_anime_${studioName}`, () => this.provider.getStudioAnime(studioName));
  }

  search = async (query: string, filters?: SearchFilters): Promise<Anime[]> => {
    return this.provider.search(query, filters);
  }
}
