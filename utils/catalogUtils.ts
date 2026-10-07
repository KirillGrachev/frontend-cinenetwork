import { Anime, CatalogSelection, AnimeType, CatalogConfig, SortOptionValue } from '../types';

/** Helper to check if an anime matches a specific selection */
export const matchesSelection = (anime: Anime, selection: CatalogSelection): boolean => {
    switch (selection) {
        case CatalogSelection.Trending: return anime.rating > 9.0;
        case CatalogSelection.New: return anime.year >= 2024;
        case CatalogSelection.Best: return anime.rating > 9.5;
        case CatalogSelection.Movies: return anime.type === AnimeType.Movie;
        default: return true;
    }
};

/** Generic helper to toggle an item in an array (Immutable update) */
export function toggleArrayItem<T>(array: T[], item: T): T[] {
    return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
}

export interface FilterState {
    seasons: string[];
    genres: string[];
    studios: string[];
    selections: CatalogSelection[];
    yearRange: { min: number; max: number };
    searchQuery: string;
}

declare global {
    interface Window {
        scheduler?: {
            yield?: () => Promise<void>;
        };
    }
}

const yieldToMain = (): Promise<void> => {
    if (typeof window !== 'undefined' && window.scheduler?.yield) {
        return window.scheduler.yield();
    }
    return new Promise(resolve => setTimeout(resolve, 0));
};

/**
 * Filter, sort, and paginate catalog items cleanly and asynchronously
 * to avoid blocking the main thread with large datasets.
 */
export const filterAndPaginateCatalogAsync = async (
    rawCatalog: Anime[],
    appliedFilters: FilterState,
    sortIndex: number,
    config: CatalogConfig,
    itemsPerPage: number,
    currentPage: number,
    t: (key: string) => string,
    signal?: AbortSignal
) => {
    if (rawCatalog.length === 0) return { pagedItems: [], totalPages: 0, totalCount: 0 };

    const active = appliedFilters;
    const q = active.searchQuery.toLowerCase().trim();

    // Cache translations to avoid heavy function calls inside the filter/sort loops
    const titleCache = new Map<string, string>();
    const getTitleLower = (title: string) => {
        let val = titleCache.get(title);
        if (val === undefined) {
            val = t(title).toLowerCase();
            titleCache.set(title, val);
        }
        return val;
    };

    const titleSortCache = new Map<string, string>();
    const getTitle = (title: string) => {
        let val = titleSortCache.get(title);
        if (val === undefined) {
            val = t(title);
            titleSortCache.set(title, val);
        }
        return val;
    };

    const genreCache = new Map<string, string>();
    const getGenreTranslated = (g: string) => {
        let val = genreCache.get(g);
        if (val === undefined) {
            val = t(`genres.${g}`);
            genreCache.set(g, val);
        }
        return val;
    };

    const hasActiveGenres = active.genres.length > 0;
    const hasActiveStudios = active.studios.length > 0;
    const hasActiveSelections = active.selections.length > 0;

    let filtered: Anime[] = [];
    const CHUNK_SIZE = 500; // Process 500 items per tick to prevent main thread blocking

    for (let i = 0; i < rawCatalog.length; i += CHUNK_SIZE) {
        if (signal?.aborted) throw new Error('Aborted');

        const chunk = rawCatalog.slice(i, i + CHUNK_SIZE);
        const filteredChunk = chunk.filter(anime => {
            if (anime.year < active.yearRange.min || anime.year > active.yearRange.max) return false;
            
            if (q && !getTitleLower(anime.title).includes(q)) return false;
            
            if (hasActiveStudios && (!anime.studio || !active.studios.includes(anime.studio))) return false;
            
            if (hasActiveGenres) {
                let hasAll = true;
                for (let i = 0; i < active.genres.length; i++) {
                    const requiredGenre = active.genres[i];
                    let found = false;
                    for (let j = 0; j < anime.genres.length; j++) {
                        if (getGenreTranslated(anime.genres[j] as string) === requiredGenre) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        hasAll = false;
                        break;
                    }
                }
                if (!hasAll) return false;
            }
            
            if (hasActiveSelections) {
                let matchesAny = false;
                for (let i = 0; i < active.selections.length; i++) {
                    if (matchesSelection(anime, active.selections[i])) {
                        matchesAny = true;
                        break;
                    }
                }
                if (!matchesAny) return false;
            }
            
            return true;
        });

        filtered.push(...filteredChunk);
        
        // Yield execution to allow UI paints and event handling
        await yieldToMain();
    }

    if (signal?.aborted) throw new Error('Aborted');

    const sortOption = config.sortOptions[sortIndex]?.value;
    if (sortOption !== undefined) {
        filtered.sort((a, b) => { 
             switch (sortOption) {
                 case SortOptionValue.Rating: return b.rating - a.rating;
                 case SortOptionValue.Newest: return b.year - a.year;
                 case SortOptionValue.Alphabet: return getTitle(a.title).localeCompare(getTitle(b.title));
                 default: return 0;
             }
        });
        
        // Yield once more after heavy sort
        await yieldToMain();
    }

    if (signal?.aborted) throw new Error('Aborted');

    const pages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;

    return {
        pagedItems: filtered.slice(start, start + itemsPerPage),
        totalPages: pages,
        totalCount: filtered.length
    };
};

/**
 * Legacy synchronous version, kept for compatibility if needed elsewhere.
 */
export const filterAndPaginateCatalog = (
    rawCatalog: Anime[],
    appliedFilters: FilterState,
    sortIndex: number,
    config: CatalogConfig,
    itemsPerPage: number,
    currentPage: number,
    t: (key: string) => string
) => {
    if (rawCatalog.length === 0) return { pagedItems: [], totalPages: 0, totalCount: 0 };

    const active = appliedFilters;
    const q = active.searchQuery.toLowerCase().trim();

    // Cache translations to avoid heavy function calls inside the filter/sort loops
    const titleCache = new Map<string, string>();
    const getTitleLower = (title: string) => {
        let val = titleCache.get(title);
        if (val === undefined) {
            val = t(title).toLowerCase();
            titleCache.set(title, val);
        }
        return val;
    };

    const titleSortCache = new Map<string, string>();
    const getTitle = (title: string) => {
        let val = titleSortCache.get(title);
        if (val === undefined) {
            val = t(title);
            titleSortCache.set(title, val);
        }
        return val;
    };

    const genreCache = new Map<string, string>();
    const getGenreTranslated = (g: string) => {
        let val = genreCache.get(g);
        if (val === undefined) {
            val = t(`genres.${g}`);
            genreCache.set(g, val);
        }
        return val;
    };

    const hasActiveGenres = active.genres.length > 0;
    const hasActiveStudios = active.studios.length > 0;
    const hasActiveSelections = active.selections.length > 0;

    let filtered = rawCatalog.filter(anime => {
        if (anime.year < active.yearRange.min || anime.year > active.yearRange.max) return false;
        
        if (q && !getTitleLower(anime.title).includes(q)) return false;
        
        if (hasActiveStudios && (!anime.studio || !active.studios.includes(anime.studio))) return false;
        
        if (hasActiveGenres) {
            let hasAll = true;
            for (let i = 0; i < active.genres.length; i++) {
                const requiredGenre = active.genres[i];
                let found = false;
                for (let j = 0; j < anime.genres.length; j++) {
                    if (getGenreTranslated(anime.genres[j] as string) === requiredGenre) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    hasAll = false;
                    break;
                }
            }
            if (!hasAll) return false;
        }
        
        if (hasActiveSelections) {
            let matchesAny = false;
            for (let i = 0; i < active.selections.length; i++) {
                if (matchesSelection(anime, active.selections[i])) {
                    matchesAny = true;
                    break;
                }
            }
            if (!matchesAny) return false;
        }
        
        return true;
    });

    const sortOption = config.sortOptions[sortIndex]?.value;
    if (sortOption !== undefined) {
        filtered.sort((a, b) => {
             switch (sortOption) {
                 case SortOptionValue.Rating: return b.rating - a.rating;
                 case SortOptionValue.Newest: return b.year - a.year;
                 case SortOptionValue.Alphabet: return getTitle(a.title).localeCompare(getTitle(b.title));
                 default: return 0;
             }
        });
    }

    const pages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    return {
        pagedItems: filtered.slice(start, start + itemsPerPage),
        totalPages: pages,
        totalCount: filtered.length
    };
};
