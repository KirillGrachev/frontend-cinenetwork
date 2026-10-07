import { BaseService } from './BaseService';
import { ICollectionService, Collection, Anime, Curator } from '../types';
import { ICollectionDataProvider } from './providers/types';
import { getCollectionDataProvider } from './providers/providerFactory';

export class CollectionService extends BaseService implements ICollectionService {
  constructor(private provider: ICollectionDataProvider = getCollectionDataProvider()) {
    super();
  }

  getCollections = (): Promise<Collection[]> => {
    return this.cachedRequest('collections', () => this.provider.getCollections());
  }

  getCollectionById = (id: number): Promise<Collection | undefined> => {
    return this.cachedRequest(`collection_${id}`, () => this.provider.getCollectionById(id));
  }

  getAnimeByCollectionId = (id: number): Promise<Anime[]> => {
    return this.cachedRequest(`collection_anime_${id}`, () => this.provider.getAnimeByCollectionId(id));
  }

  getCuratorsByCollectionId = (id: number): Promise<Curator[]> => {
    return this.cachedRequest(`collection_curators_${id}`, () => this.provider.getCuratorsByCollectionId(id));
  }

  search = async (query: string): Promise<Collection[]> => {
    const collections = await this.getCollections();
    const lowerCaseQuery = query.toLowerCase().trim();
    if (!lowerCaseQuery) return [];

    return collections.filter(item => 
        this.getTranslatedString(item.title).toLowerCase().includes(lowerCaseQuery)
    );
  }
}
