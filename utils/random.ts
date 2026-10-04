/**
 * Deterministic pseudo-random utilities.
 *
 * Mock/demo data must be stable between calls: values re-randomised on
 * every invocation make lists jump around on each refetch and defeat
 * React Query caching. Seed by entity id for varied yet reproducible data.
 */

/** mulberry32 — small, fast, good-enough PRNG. */
export function seededRandom(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** Deterministic 32-bit string hash (for seeding by id/name). */
export function hashString(value: string): number {
    let h = 0;
    for (let i = 0; i < value.length; i++) {
        h = (h * 31 + value.charCodeAt(i)) >>> 0;
    }
    return h;
}

/**
 * Deterministic Fisher–Yates shuffle. Replaces the classic
 * `arr.sort(() => Math.random() - 0.5)` anti-pattern, which is both
 * non-uniform and unstable between renders.
 */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
    const result = [...items];
    const random = seededRandom(seed);
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
