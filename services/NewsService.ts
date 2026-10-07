import { BaseService } from './BaseService';
import { INewsService, NewsItem } from '../types';
import { INewsDataProvider } from './providers/types';
import { getNewsDataProvider } from './providers/providerFactory';

export class NewsService extends BaseService implements INewsService {
  constructor(private provider: INewsDataProvider = getNewsDataProvider()) {
    super();
  }

  getNewsItems = (): Promise<NewsItem[]> => {
    return this.cachedRequest('newsItems', () => this.provider.getNewsItems());
  }

  getNewsItemById = (id: number): Promise<NewsItem | undefined> => {
    return this.cachedRequest(`newsItem_${id}`, () => this.provider.getNewsItemById(id));
  }

  search = async (query: string): Promise<NewsItem[]> => {
    const items = await this.getNewsItems();
    const lowerCaseQuery = query.toLowerCase().trim();
    if (!lowerCaseQuery) return [];

    return items.filter(item =>
        this.getTranslatedString(item.title).toLowerCase().includes(lowerCaseQuery) ||
        this.getTranslatedString(item.excerpt).toLowerCase().includes(lowerCaseQuery)
    );
  }
}
