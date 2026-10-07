import { describe, it, expect } from 'vitest';
import { matchesSelection, toggleArrayItem } from './catalogUtils';
import { Anime, CatalogSelection, AnimeType } from '../types';

describe('catalogUtils', () => {
    describe('matchesSelection', () => {
        const mockAnime: Partial<Anime> = {
            rating: 9.2,
            year: 2024,
            type: AnimeType.TV
        };

        it('should return true for Trending if rating > 9.0', () => {
            expect(matchesSelection(mockAnime as Anime, CatalogSelection.Trending)).toBe(true);
        });

        it('should return false for Trending if rating <= 9.0', () => {
            expect(matchesSelection({ ...mockAnime, rating: 9.0 } as Anime, CatalogSelection.Trending)).toBe(false);
        });

        it('should return true for New if year >= 2024', () => {
            expect(matchesSelection(mockAnime as Anime, CatalogSelection.New)).toBe(true);
        });

        it('should return true for Movies if type is Movie', () => {
            expect(matchesSelection({ ...mockAnime, type: AnimeType.Movie } as Anime, CatalogSelection.Movies)).toBe(true);
        });
    });

    describe('toggleArrayItem', () => {
        it('should add item if not present', () => {
            expect(toggleArrayItem([1, 2], 3)).toEqual([1, 2, 3]);
        });

        it('should remove item if present', () => {
            expect(toggleArrayItem([1, 2, 3], 2)).toEqual([1, 3]);
        });
    });
});
