import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { collectionService, animeService } from '../services/apiService';
import { CollectionFilter } from '../types';
import type { Anime, Collection, CollectionViewModel } from '../types';

/** Stable identities so derived memos don't re-run on every render. */
const EMPTY_COLLECTIONS: Collection[] = [];
const EMPTY_CATALOG: Anime[] = [];
import { useLocale } from '../context/LocaleContext';

/** Shared view-model type — defined in the type layer, re-exported for convenience. */
export type { CollectionViewModel } from '../types';

export const useCollectionsLogic = () => {
    const { t } = useLocale();
    const [activeFilterIndex, setActiveFilterIndex] = useState(0);

    // Smooth loading state for initial mount
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 600); // 600ms minimum load time for skeleton
        return () => clearTimeout(timer);
    }, []);

    /** Filter Configuration */
    const filterOptions = useMemo(
        () => [
            {
                label: t('collections.filters.all'),
                value: CollectionFilter.All,
                icon: 'fa-solid fa-layer-group',
            },
            {
                label: t('collections.filters.editorial'),
                value: CollectionFilter.Editorial,
                icon: 'fa-solid fa-pen-nib',
            },
            {
                label: t('collections.filters.community'),
                value: CollectionFilter.Community,
                icon: 'fa-solid fa-users',
            },
        ],
        [t],
    );

    const activeFilter = filterOptions[activeFilterIndex];

    /** Data Fetching */
    // We include activeFilter.value in the queryKey.
    // In a real backend scenario, we would pass this filter to the API.
    // Here, keeping it in the key ensures React Query treats different filters as different cache entries,
    // but keepPreviousData ensures smooth transitions.
    const {
        data: rawData,
        isLoading: isQueryLoading,
        error,
        isPlaceholderData,
    } = useQuery({
        queryKey: ['collectionsPageData', activeFilter.value],
        queryFn: async () => {
            // Simulate network delay for the "new" filtered data
            // In real app: await collectionService.getCollections({ type: activeFilter.value })
            const [collections, catalog] = await Promise.all([
                collectionService.getCollections(),
                animeService.getFullCatalog(),
            ]);
            return { collections, catalog };
        },
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
    });

    const collections = rawData?.collections ?? EMPTY_COLLECTIONS;
    const catalog = rawData?.catalog ?? EMPTY_CATALOG;

    /** Logic: Client-side Filtering (Simulating Server logic) */
    const filteredRawCollections = useMemo(() => {
        if (activeFilter.value === CollectionFilter.All) return collections;

        return collections.filter((c) => {
            const isGenerated = c.title.includes('#');
            if (activeFilter.value === CollectionFilter.Editorial) return !isGenerated;
            if (activeFilter.value === CollectionFilter.Community) return isGenerated;
            return true;
        });
    }, [collections, activeFilter]);

    /** Logic: Data Shaping */
    const getPreviews = useCallback(
        (seed: number): string[] => {
            if (catalog.length < 3) return [];
            const start = seed % (catalog.length - 2);
            return catalog.slice(start, start + 3).map((a) => a.thumbnailUrl);
        },
        [catalog],
    );

    const allViewModels: CollectionViewModel[] = useMemo(() => {
        return filteredRawCollections.map((c, idx) => {
            const previews = getPreviews(idx + c.id);
            const bgImages = [...previews, ...previews].slice(0, 4);

            return {
                ...c,
                previews,
                bgImages,
            };
        });
    }, [filteredRawCollections, getPreviews]);

    // Extract featured item separately (first item)
    const featuredItem = allViewModels.length > 0 ? allViewModels[0] : null;
    const gridItems = allViewModels.length > 0 ? allViewModels.slice(1) : [];

    // Combined loading state
    const isLoading = isInitialLoading || (isQueryLoading && !isPlaceholderData);

    /** Actions */
    const actions = {
        cycleFilter: () => {
            setActiveFilterIndex((prev) => (prev + 1) % filterOptions.length);
        },
    };

    return {
        state: {
            isLoading,
            error,
            featuredItem,
            visibleGridItems: gridItems,
            activeFilter,
            hasResults: allViewModels.length > 0,
        },
        actions,
    };
};
