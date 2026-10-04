import { describe, it, expect } from 'vitest';
import { hashString, seededRandom, seededShuffle } from './random';

describe('seededRandom', () => {
    it('is deterministic for the same seed', () => {
        const a = seededRandom(42);
        const b = seededRandom(42);
        const seqA = Array.from({ length: 10 }, () => a());
        const seqB = Array.from({ length: 10 }, () => b());
        expect(seqA).toEqual(seqB);
    });

    it('produces different sequences for different seeds', () => {
        const a = seededRandom(1);
        const b = seededRandom(2);
        expect(a()).not.toBe(b());
    });

    it('stays within [0, 1)', () => {
        const random = seededRandom(7);
        for (let i = 0; i < 1000; i++) {
            const value = random();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        }
    });
});

describe('hashString', () => {
    it('is stable and distinguishes inputs', () => {
        expect(hashString('abc')).toBe(hashString('abc'));
        expect(hashString('abc')).not.toBe(hashString('abd'));
        expect(hashString('')).toBe(0);
    });
});

describe('seededShuffle', () => {
    it('returns a permutation of the input', () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const shuffled = seededShuffle(input, 123);
        expect([...shuffled].sort((a, b) => a - b)).toEqual(input);
    });

    it('is deterministic for the same seed', () => {
        const input = ['a', 'b', 'c', 'd', 'e'];
        expect(seededShuffle(input, 9)).toEqual(seededShuffle(input, 9));
    });

    it('does not mutate the input array', () => {
        const input = [1, 2, 3];
        seededShuffle(input, 5);
        expect(input).toEqual([1, 2, 3]);
    });

    it('handles empty and single-element arrays', () => {
        expect(seededShuffle([], 1)).toEqual([]);
        expect(seededShuffle(['x'], 1)).toEqual(['x']);
    });
});
