import { describe, it, expect } from 'vitest';
import { generateAnimeSchema, generateBreadcrumbSchema, generateEpisodeSchema } from './seoUtils';
import type { AnimeDetails, Episode } from '../types';
import { AnimeType, AnimeGenre } from '../types';

const anime: AnimeDetails = {
    id: 5,
    title: 'Test Anime',
    description: 'A test description',
    thumbnailUrl: '/thumb.jpg',
    coverUrl: '/cover.jpg',
    rating: 8.4,
    genres: [AnimeGenre.Action],
    year: 2023,
    studio: 'Test Studio',
    type: AnimeType.TV,
    status: 'released',
    episodesCount: 12,
};

const episode: Episode = {
    id: 1,
    number: 3,
    title: 'Episode 3',
    image: '/ep.jpg',
    duration: '24 min',
    airDate: '2023-01-15',
};

describe('generateAnimeSchema', () => {
    it('produces a TVSeries schema for a TV anime', () => {
        const schema = generateAnimeSchema(anime, 'https://site/anime/5', 'CineNetwork');
        expect(schema['@type']).toBe('TVSeries');
        expect(schema['name']).toBe('Test Anime');
        expect(schema['numberOfEpisodes']).toBe(12);
        expect(schema['publisher']).toEqual({ '@type': 'Organization', name: 'CineNetwork' });
    });

    it('produces a Movie schema with ISO duration for movies', () => {
        const movie = {
            ...anime,
            type: AnimeType.Movie,
            episodesCount: undefined,
            duration: '110 min',
        };
        const schema = generateAnimeSchema(movie, 'https://site/anime/5', 'CineNetwork');
        expect(schema['@type']).toBe('Movie');
        expect(schema['duration']).toBe('PT110M');
        expect(schema['numberOfEpisodes']).toBeUndefined();
    });

    it('includes aggregateRating only for positive ratings', () => {
        expect(generateAnimeSchema(anime, 'u', 'app')['aggregateRating']).toBeDefined();
        const unrated = { ...anime, rating: 0 };
        expect(generateAnimeSchema(unrated, 'u', 'app')['aggregateRating']).toBeUndefined();
    });

    it('absolutises relative image URLs', () => {
        const schema = generateAnimeSchema(anime, 'u', 'app') as { image: string };
        expect(schema.image.startsWith(window.location.origin)).toBe(true);
    });
});

describe('generateEpisodeSchema', () => {
    it('links the episode to its series', () => {
        const schema = generateEpisodeSchema(anime, episode, 'https://site/watch/5?ep=3');
        expect(schema['@type']).toBe('TVEpisode');
        expect(schema['episodeNumber']).toBe(3);
        expect(schema['duration']).toBe('PT24M');
        expect(schema['partOfSeries']).toMatchObject({ '@type': 'TVSeries', name: 'Test Anime' });
    });
});

describe('generateBreadcrumbSchema', () => {
    it('numbers positions from 1 and absolutises paths', () => {
        const schema = generateBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Catalog', path: '/catalog' },
        ]);
        const items = schema['itemListElement'] as Array<Record<string, unknown>>;
        expect(items[0].position).toBe(1);
        expect(items[1].position).toBe(2);
        expect(String(items[1].item)).toBe(`${window.location.origin}/catalog`);
    });

    it('keeps absolute URLs untouched', () => {
        const schema = generateBreadcrumbSchema([{ name: 'X', path: 'https://external/x' }]);
        const items = schema['itemListElement'] as Array<Record<string, unknown>>;
        expect(items[0].item).toBe('https://external/x');
    });
});
