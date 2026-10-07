import { describe, it, expect } from 'vitest';
import { mapAnimeDtoToDomain } from './animeMapper';
import { AnimeDTO } from '../types/dtos';
import { AnimeType } from '../types/enums';

describe('animeMapper', () => {
    describe('mapAnimeDtoToDomain', () => {
        it('should map standard DTO correctly', () => {
            const dto: AnimeDTO = {
                id: '1',
                title: 'Test Anime',
                description: 'Test Description',
                thumbnail_url: '/test.jpg',
                rating_float: 8.5,
                genres: ['Action', 'Fantasy'],
                release_year: 2023,
                studio_name: 'Test Studio',
                type_code: AnimeType.TV
            };

            const domain = mapAnimeDtoToDomain(dto);
            
            expect(domain.id).toBe('1');
            expect(domain.title).toBe('Test Anime');
            expect(domain.description).toBe('Test Description');
            expect(domain.thumbnailUrl).toBe('/test.jpg');
            expect(domain.rating).toBe(8.5);
            expect(domain.genres).toEqual(['Action', 'Fantasy']);
            expect(domain.year).toBe(2023);
            expect(domain.studio).toBe('Test Studio');
            expect(domain.type).toBe(AnimeType.TV);
        });

        it('should handle missing fields with default values', () => {
            const dto: AnimeDTO = {
                id: '2',
            };

            const domain = mapAnimeDtoToDomain(dto);
            
            expect(domain.id).toBe('2');
            expect(domain.title).toBe('');
            expect(domain.description).toBe('');
            expect(domain.thumbnailUrl).toBe('/assets/placeholder-cover.jpeg');
            expect(domain.rating).toBe(0);
            expect(domain.genres).toEqual([]);
            expect(domain.year).toBe(new Date().getFullYear());
            expect(domain.studio).toBeUndefined();
            expect(domain.type).toBe(AnimeType.TV);
        });
    });
});
