import { describe, it, expect, vi, afterEach } from 'vitest';
import { mapAnimeDtoToDomain, mapNewsDtoToDomain } from '../../mappers/animeMapper';
import { ApiAnimeProvider, ApiNewsProvider, ApiAuthProvider } from './apiProvider';
import type { AnimeDTO, NewsItemDTO } from '../../types/dtos';
import { ContentType } from '../../types';

const animeDto: AnimeDTO = {
    id: 1,
    title: 'Server Anime',
    description: 'from api',
    thumbnail_url: '/s.jpg',
    rating_float: 9,
    genres: ['action'],
    release_year: 2024,
};

const mockFetchJson = <T>(payload: T, ok = true, status = 200) => {
    const fetchMock = vi.fn().mockResolvedValue({
        ok,
        status,
        json: async () => payload,
        text: async () => JSON.stringify(payload),
    });
    vi.stubGlobal('fetch', fetchMock);
    return fetchMock;
};

describe('ApiAnimeProvider', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('maps DTOs from the REST endpoint into domain models', async () => {
        const fetchMock = mockFetchJson([animeDto]);
        const provider = new ApiAnimeProvider();

        const result = await provider.getNewReleases();

        expect(result).toEqual([mapAnimeDtoToDomain(animeDto)]);
        const url = fetchMock.mock.calls[0][0] as string;
        expect(url).toContain('/api/anime/new');
    });

    it('propagates HTTP failures instead of silently falling back to mocks', async () => {
        mockFetchJson({ error: 'boom' }, false, 500);
        const provider = new ApiAnimeProvider();
        await expect(provider.getTrendingAnime()).rejects.toMatchObject({
            name: 'ApiError',
            status: 500,
        });
    });

    it('builds search query strings from filters', async () => {
        const fetchMock = mockFetchJson([]);
        const provider = new ApiAnimeProvider();

        await provider.search('one piece', { genre: 'action', year: '2020' });

        const url = fetchMock.mock.calls[0][0] as string;
        expect(url).toContain('/api/search?');
        expect(url).toContain('q=one+piece');
        expect(url).toContain('genre=action');
        expect(url).toContain('year=2020');
    });
});

describe('ApiNewsProvider', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('maps full-post payload including content blocks', async () => {
        const dto: NewsItemDTO = {
            id: 3,
            title: 'Release notes',
            excerpt_text: 'short',
            published_date: '2026-05-01',
            read_time_minutes: '4 min',
            tags: ['devlog'],
            is_featured: true,
            content_blocks: [
                { type: 'paragraph', content: 'Hello' },
                { type: 'unknown-block', content: 'x' },
            ],
            toc: ['Intro'],
        };
        mockFetchJson([dto]);

        const items = await new ApiNewsProvider().getNewsItems();

        expect(items[0]).toEqual({
            ...mapNewsDtoToDomain(dto),
            contentBlocks: [
                { type: ContentType.Paragraph, content: 'Hello', items: undefined },
                { type: ContentType.Paragraph, content: 'x', items: undefined }, // unknown → fallback
            ],
        });
    });

    it('maps a null body to undefined (404-style soft miss)', async () => {
        mockFetchJson(null);
        await expect(new ApiNewsProvider().getNewsItemById(404)).resolves.toBeUndefined();
    });
});

describe('ApiAuthProvider', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('POSTs credentials and maps the session user', async () => {
        const fetchMock = mockFetchJson({
            token: 'jwt-token',
            user: {
                id: 1,
                username: 'neo',
                email: 'neo@matrix.io',
                is_premium: true,
                role: 'admin',
                join_date: '2020-01-01',
            },
        });

        const session = await new ApiAuthProvider().login({
            email: 'neo@matrix.io',
            password: 'pw',
        });

        expect(session.token).toBe('jwt-token');
        expect(session.user.username).toBe('neo');
        expect(session.user.isPremium).toBe(true);
        expect(session.user.role).toBe('admin');

        const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
        expect(init.method).toBe('POST');
        expect(init.body).toBe(JSON.stringify({ email: 'neo@matrix.io', password: 'pw' }));
    });
});
