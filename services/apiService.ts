
import { Anime, Collection, NewsItem, SearchCategory, SearchFilters } from '../types';
import { AnimeService } from './AnimeService';
import { NewsService } from './NewsService';
import { CollectionService } from './CollectionService';
import { UserService } from './UserService';
import { NotificationService } from './NotificationService';
import { AdminService } from './AdminService';
import { StatusService } from './StatusService';

/** Create and export singleton instances of each specific service */
export const animeService = new AnimeService();
export const newsService = new NewsService();
export const collectionService = new CollectionService();
export const userService = new UserService();
export const notificationService = new NotificationService();
export const adminService = new AdminService();
export const statusService = new StatusService();

/** Facade Pattern: Aggregates specific services into a single access point. */
/** This is now primarily used for multi-category search. */
class ApiService {
  /** --- Aggregated Search (Facade Logic) --- */
  search = async (query: string, category: SearchCategory, filters?: SearchFilters): Promise<Anime[] | Collection[] | NewsItem[]> => {
    switch (category) {
      case SearchCategory.Anime:
        return animeService.search(query, filters);
      case SearchCategory.News:
        return newsService.search(query);
      case SearchCategory.Collections:
        return collectionService.search(query);
      default:
        return [];
    }
  }
}

/** Export the aggregated facade for multi-domain operations like search */
export const apiService = new ApiService();
