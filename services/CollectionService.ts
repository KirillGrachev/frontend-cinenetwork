import type { ICollectionService, Anime, Collection, Curator } from '../types';
import type { ICollectionDataProvider } from './providers/types';
import { getCollectionDataProvider } from './providers/providerFactory';
import { resolveTranslationKey } from '../locales/registry';

export class CollectionService implements ICollectionService {
    constructor(private readonly provider: ICollectionDataProvider = getCollectionDataProvider()) {}

    getCollections = (): Promise<Collection[]> => {
        return this.provider.getCollections();
    };

    getCollectionById = (id: number): Promise<Collection | undefined> => {
        return this.provider.getCollectionById(id);
    };

    getAnimeByCollectionId = (id: number): Promise<Anime[]> => {
        return this.provider.getAnimeByCollectionId(id);
    };

    getCuratorsByCollectionId = (id: number): Promise<Curator[]> => {
        return this.provider.getCuratorsByCollectionId(id);
    };

    /** Client-side search; fixture titles are i18n keys (see NewsService). */
    search = async (query: string): Promise<Collection[]> => {
        const normalized = query.toLowerCase().trim();
        if (!normalized) return [];

        const collections = await this.getCollections();
        return collections.filter((item) =>
            resolveTranslationKey(item.title).toLowerCase().includes(normalized),
        );
    };
}
