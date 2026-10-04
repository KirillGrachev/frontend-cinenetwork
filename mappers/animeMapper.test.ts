import { describe, it, expect } from 'vitest';
import {
    mapAnimeDetailsDtoToDomain,
    mapAnimeDtoToDomain,
    mapBannerDtoToDomain,
    mapNewsDtoToDomain,
} from './animeMapper';
import type { AnimeDTO, AnimeDetailsDTO } from '../types/dtos';
import { AnimeGenre, AnimeType } from '../types/enums';

describe('animeMapper', () => {
    describe('mapAnimeDtoToDomain', () => {
        it('maps a full snake_case DTO to the domain model', () => {
            const dto: AnimeDTO = {
                id: 1,
                title: 'Test Anime',
                description: 'Test Description',
                thumbnail_url: '/test.jpg',
                cover_url: '/cover.jpg',
                rating_float: 8.5,
                genres: [AnimeGenre.Action, AnimeGenre.Fantasy],
                release_year: 2023,
                studio_name: 'Test Studio',
                type_code: AnimeType.TV,
            };

            const domain = mapAnimeDtoToDomain(dto);

            expect(domain).toEqual({
                id: 1,
                title: 'Test Anime',
                description: 'Test Description',
                thumbnailUrl: '/test.jpg',
                coverUrl: '/cover.jpg',
                rating: 8.5,
                genres: [AnimeGenre.Action, AnimeGenre.Fantasy],
                year: 2023,
                studio: 'Test Studio',
                type: AnimeType.TV,
            });
        });

        it('accepts camelCase aliases', () => {
            const dto: AnimeDTO = {
                id: 2,
                title: 'Alias',
                description: 'd',
                thumbnailUrl: '/t.jpg',
                coverUrl: '/c.jpg',
                rating: 7,
                year: 2020,
                studio: 'S',
                type: AnimeType.Movie,
            };

            const domain = mapAnimeDtoToDomain(dto);
            expect(domain.thumbnailUrl).toBe('/t.jpg');
            expect(domain.rating).toBe(7);
            expect(domain.year).toBe(2020);
            expect(domain.type).toBe(AnimeType.Movie);
        });

        it('falls back to safe defaults for missing fields', () => {
            const domain = mapAnimeDtoToDomain({ id: 3 } as AnimeDTO);

            expect(domain.title).toBe('');
            expect(domain.thumbnailUrl).toBe('/assets/placeholder-cover.jpeg');
            expect(domain.rating).toBe(0);
            expect(domain.genres).toEqual([]);
            expect(domain.year).toBe(new Date().getFullYear());
            expect(domain.studio).toBeUndefined();
            expect(domain.type).toBe(AnimeType.TV);
        });

        it('drops unknown genres instead of leaking invalid enum values', () => {
            const dto: AnimeDTO = {
                id: 4,
                title: 't',
                description: 'd',
                genres: [AnimeGenre.Action, 'not_a_genre'],
            };
            expect(mapAnimeDtoToDomain(dto).genres).toEqual([AnimeGenre.Action]);
        });

        it('normalises an unknown type_code to TV', () => {
            const dto: AnimeDTO = { id: 5, title: 't', description: 'd', type_code: 'ona-unknown' };
            expect(mapAnimeDtoToDomain(dto).type).toBe(AnimeType.TV);
        });
    });

    describe('mapAnimeDetailsDtoToDomain', () => {
        it('maps nested collections and normalises status', () => {
            const dto: AnimeDetailsDTO = {
                id: 10,
                title: 'Details',
                description: 'd',
                status_code: 'ONGOING-INVALID',
                characters_data: [
                    { id: 1, name: 'Loid', role: 'protagonist', image_url: '/l.png' },
                ],
                episodes_data: [
                    {
                        id: 1,
                        number: 1,
                        title: 'Ep 1',
                        image: '/e.png',
                        duration: '24m',
                        air_date: '2023-01-01',
                    },
                ],
                similars_data: [{ id: 11, title: 'Similar', description: 's' }],
            };

            const domain = mapAnimeDetailsDtoToDomain(dto);

            expect(domain.status).toBe('released'); // unknown → fallback
            expect(domain.characters?.[0].role).toBe('Supporting'); // unknown → fallback
            expect(domain.episodesList?.[0].airDate).toBe('2023-01-01');
            expect(domain.similar?.[0].id).toBe(11);
            expect(domain.originalTitle).toBe('Details'); // falls back to title
        });
    });

    describe('mapBannerDtoToDomain', () => {
        it('maps image/alt/link with aliases', () => {
            expect(
                mapBannerDtoToDomain({
                    id: 1,
                    image_url: '/b.jpg',
                    alt: 'Promo',
                    link_url: '/promo',
                }),
            ).toEqual({ id: 1, imageUrl: '/b.jpg', alt: 'Promo', link: '/promo' });
        });
    });

    describe('mapNewsDtoToDomain', () => {
        it('maps with defaults for missing fields', () => {
            const domain = mapNewsDtoToDomain({
                id: 7,
                title: 'News',
                excerpt_text: 'e',
                tags: ['devlog'],
            });
            expect(domain.excerpt).toBe('e');
            expect(domain.readTime).toBe('3 min');
            expect(domain.tags).toEqual(['devlog']);
            expect(domain.isFeatured).toBe(false);
        });
    });
});
