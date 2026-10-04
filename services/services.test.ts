import { describe, it, expect, vi } from 'vitest';
import { AnimeService } from './AnimeService';
import { NewsService } from './NewsService';
import type { IAnimeDataProvider, INewsDataProvider } from './providers/types';
import type { Anime, NewsItem } from '../types';
import { AnimeGenre } from '../types';
import { loadLocaleDictionary } from '../locales/registry';

/**
 * Services are tested through their injected providers (constructor DI) —
 * no module mocking required for the happy paths.
 */

const makeAnime = (id: number, overrides: Partial<Anime> = {}): Anime => ({
    id,
    title: `mock.anime${id}.title`,
    description: `desc ${id}`,
    thumbnailUrl: `/t${id}.jpg`,
    coverUrl: `/c${id}.jpg`,
    rating: 7,
    genres: [AnimeGenre.Action],
    year: 2020,
    ...overrides,
});

function fakeAnimeProvider(overrides: Partial<IAnimeDataProvider> = {}): IAnimeDataProvider {
    return {
        getFeaturedAnime: vi.fn().mockResolvedValue(makeAnime(1)),
        getNewReleases: vi.fn().mockResolvedValue([makeAnime(2)]),
        getTrendingAnime: vi.fn().mockResolvedValue([]),
        getFullCatalog: vi.fn().mockResolvedValue([makeAnime(1), makeAnime(2)]),
        getHomeBanners: vi.fn().mockResolvedValue([]),
        getFavorites: vi.fn().mockResolvedValue([]),
        getAnimeDetails: vi.fn().mockResolvedValue(undefined),
        getCharacterDetails: vi.fn().mockResolvedValue(undefined),
        getStudioAnime: vi.fn().mockResolvedValue([]),
        search: vi.fn().mockResolvedValue([]),
        ...overrides,
    } as IAnimeDataProvider;
}

describe('AnimeService', () => {
    it('delegates to the provider without extra caching', async () => {
        const provider = fakeAnimeProvider();
        const service = new AnimeService(provider);

        await expect(service.getFeaturedAnime()).resolves.toEqual(makeAnime(1));
        expect(provider.getFeaturedAnime).toHaveBeenCalledOnce();

        await service.getAnimeDetails(9);
        expect(provider.getAnimeDetails).toHaveBeenCalledWith(9);
    });

    it('passes search filters through', async () => {
        const provider = fakeAnimeProvider();
        const service = new AnimeService(provider);
        await service.search('query', { genre: 'action', year: '2020' });
        expect(provider.search).toHaveBeenCalledWith('query', { genre: 'action', year: '2020' });
    });
});

describe('NewsService.search', () => {
    const news: NewsItem[] = [
        {
            id: 1,
            title: 'mock.news1.title',
            excerpt: 'mock.news1.excerpt',
            date: '2026-01-01',
            readTime: '3',
            tags: [],
        },
        {
            id: 2,
            title: 'Plain Text Post',
            excerpt: 'about frontend',
            date: '2026-01-02',
            readTime: '2',
            tags: [],
        },
    ];

    function makeService(): NewsService {
        const provider: INewsDataProvider = {
            getNewsItems: vi.fn().mockResolvedValue(news),
            getNewsItemById: vi.fn(),
        };
        return new NewsService(provider);
    }

    it('returns [] for an empty query without hitting the provider', async () => {
        const provider: INewsDataProvider = { getNewsItems: vi.fn(), getNewsItemById: vi.fn() };
        const service = new NewsService(provider);
        await expect(service.search('   ')).resolves.toEqual([]);
        expect(provider.getNewsItems).not.toHaveBeenCalled();
    });

    it('matches plain-text titles', async () => {
        const service = makeService();
        const result = await service.search('plain');
        expect(result.map((n) => n.id)).toEqual([2]);
    });

    it('resolves i18n keys of fixtures before matching (ru dictionary)', async () => {
        await loadLocaleDictionary('ru'); // populate the registry cache
        const service = makeService();
        // 'mock.news1.title' resolves to "Добро пожаловать в CineNetwork".
        const result = await service.search('cinenetwork');
        expect(result.map((n) => n.id)).toContain(1);
    });
});
