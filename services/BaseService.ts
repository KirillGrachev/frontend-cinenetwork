
import { ru } from '../locales/translations';

export abstract class BaseService {
  // We removed the internal Map cache. 
  // Now every request goes through to the "API" (mock logic), 
  // allowing React Query to manage cache lifetime, staleness, and background refetching.

  protected async fakeDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected getTranslatedString(key: string): string {
    if (!key || !key.includes('.')) return key;
    try {
      return key.split('.').reduce((acc, part) => acc && acc[part], ru as any) || key;
    } catch (e) {
      return key;
    }
  }

  /**
   * Wrapper for requests.
   * Previously this cached data internally. Now it acts as a passthrough.
   * The 'cacheKey' parameter is kept for compatibility but ignored, 
   * as caching is now the responsibility of the QueryClient.
   */
  protected async cachedRequest<T>(cacheKey: string, fetchFn: () => Promise<T>): Promise<T> {
    // In a real app, this might handle global error catching or auth headers.
    // For SWR to work, we must ALWAYS execute the fetchFn when called,
    // so React Query determines when to call this based on staleTime.
    return fetchFn();
  }
}
