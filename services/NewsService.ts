import type { INewsService, NewsItem } from '../types';
import type { INewsDataProvider } from './providers/types';
import { getNewsDataProvider } from './providers/providerFactory';
import { resolveTranslationKey } from '../locales/registry';

export class NewsService implements INewsService {
    constructor(private readonly provider: INewsDataProvider = getNewsDataProvider()) {}

    getNewsItems = (): Promise<NewsItem[]> => {
        return this.provider.getNewsItems();
    };

    getNewsItemById = (id: number): Promise<NewsItem | undefined> => {
        return this.provider.getNewsItemById(id);
    };

    /**
     * Client-side search over news. Fixtures store i18n keys as titles,
     * so both the raw key and its resolved text are matched.
     */
    search = async (query: string): Promise<NewsItem[]> => {
        const normalized = query.toLowerCase().trim();
        if (!normalized) return [];

        const items = await this.getNewsItems();
        return items.filter((item) => {
            const title = resolveTranslationKey(item.title).toLowerCase();
            const excerpt = resolveTranslationKey(item.excerpt).toLowerCase();
            return title.includes(normalized) || excerpt.includes(normalized);
        });
    };
}
