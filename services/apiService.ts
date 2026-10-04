import type { Anime, Collection, NewsItem, SearchFilters } from '../types';
import { SearchCategory } from '../types';
import { AnimeService } from './AnimeService';
import { NewsService } from './NewsService';
import { CollectionService } from './CollectionService';
import { UserService } from './UserService';
import { NotificationService } from './NotificationService';
import { AdminService } from './AdminService';
import { StatusService } from './StatusService';

/** Singleton service instances used across the app (provider is injectable per service for tests). */
export const animeService = new AnimeService();
export const newsService = new NewsService();
export const collectionService = new CollectionService();
export const userService = new UserService();
export const notificationService = new NotificationService();
export const adminService = new AdminService();
export const statusService = new StatusService();

/**
 * Cross-domain facade. Currently only used for category-aware search;
 * overloads give call sites a precise result type per category instead of
 * the previous `Anime[] | Collection[] | NewsItem[]` union that forced
 * `as any` casts at every consumer.
 */
class ApiService {
    search(
        query: string,
        category: SearchCategory.Anime,
        filters?: SearchFilters,
    ): Promise<Anime[]>;
    search(query: string, category: SearchCategory.News): Promise<NewsItem[]>;
    search(query: string, category: SearchCategory.Collections): Promise<Collection[]>;
    search(
        query: string,
        category: SearchCategory,
        filters?: SearchFilters,
    ): Promise<Anime[] | NewsItem[] | Collection[]>;
    search(
        query: string,
        category: SearchCategory,
        filters?: SearchFilters,
    ): Promise<Anime[] | NewsItem[] | Collection[]> {
        switch (category) {
            case SearchCategory.Anime:
                return animeService.search(query, filters);
            case SearchCategory.News:
                return newsService.search(query);
            case SearchCategory.Collections:
                return collectionService.search(query);
            default:
                return Promise.resolve([]);
        }
    }
}

export const apiService = new ApiService();
