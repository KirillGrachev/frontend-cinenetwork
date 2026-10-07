import { useEffect, useMemo, useReducer, useState, useDeferredValue } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { animeService } from '../services/apiService';
import { CatalogConfig, CatalogSelection, CatalogFilterType, QueryKey } from '../types';
import { getCatalogConfig } from '../constants';
import { useLocale } from '../context/LocaleContext';
import {
    FilterState,
    toggleArrayItem,
    filterAndPaginateCatalog,
    filterAndPaginateCatalogAsync
} from '../utils/catalogUtils';

const ITEMS_PER_PAGE = 15;

interface UseCatalogLogicParams {
    itemsPerPage?: number;
}

interface CatalogState {
    filters: FilterState;        // Draft state (UI checkboxes)
    appliedFilters: FilterState; // Active state (Filtering logic)
    sortIndex: number;
    currentPage: number;
}

type CatalogAction =
    | { type: 'SYNC_PARAMS'; payload: { selection?: CatalogSelection; genre?: string; studio?: string; year?: number; query?: string } }
    | { type: 'TOGGLE_FILTER'; payload: { list: CatalogFilterType; item: string | CatalogSelection; applyImmediately?: boolean } }
    | { type: 'SET_YEAR_RANGE'; payload: { min: number; max: number } }
    | { type: 'SET_SEARCH_QUERY'; payload: string }
    | { type: 'RESET_FILTERS'; payload: { defaultYearRange: { min: number; max: number } } }
    | { type: 'APPLY_FILTERS' }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'CYCLE_SORT'; payload: { totalOptions: number } };

const catalogReducer = (state: CatalogState, action: CatalogAction): CatalogState => {
    switch (action.type) {
        case 'SYNC_PARAMS': {
            const { selection, genre, studio, year, query } = action.payload;
            const newFilters = {
                ...state.filters,
                selections: selection ? [selection] : state.filters.selections,
                genres: genre ? [genre] : state.filters.genres,
                studios: studio ? [studio] : state.filters.studios,
                yearRange: year ? { min: year, max: year } : state.filters.yearRange,
                searchQuery: query || state.filters.searchQuery
            };
            return {
                ...state,
                filters: newFilters,
                appliedFilters: newFilters,
                currentPage: 1
            };
        }
        case 'TOGGLE_FILTER': {
            const { list, item, applyImmediately } = action.payload;
            let newFilters = { ...state.filters };
            switch (list) {
                case CatalogFilterType.Seasons: newFilters.seasons = toggleArrayItem(state.filters.seasons, item as string); break;
                case CatalogFilterType.Genres: newFilters.genres = toggleArrayItem(state.filters.genres, item as string); break;
                case CatalogFilterType.Studios: newFilters.studios = toggleArrayItem(state.filters.studios, item as string); break;
                case CatalogFilterType.Selections: newFilters.selections = toggleArrayItem(state.filters.selections, item as CatalogSelection); break;
            }
            
            if (applyImmediately) {
                return { ...state, filters: newFilters, appliedFilters: newFilters, currentPage: 1 };
            }

            return { ...state, filters: newFilters };
        }
        case 'SET_YEAR_RANGE':
            return { ...state, filters: { ...state.filters, yearRange: action.payload } };
        case 'SET_SEARCH_QUERY':
            return { 
                ...state, 
                filters: { ...state.filters, searchQuery: action.payload },
                appliedFilters: { ...state.appliedFilters, searchQuery: action.payload },
                currentPage: 1
            };
        case 'RESET_FILTERS':
            const emptyFilters = {
                seasons: [], genres: [], studios: [], selections: [],
                yearRange: action.payload.defaultYearRange, searchQuery: ''
            };
            return { ...state, filters: emptyFilters, appliedFilters: emptyFilters, sortIndex: 0, currentPage: 1 };
        case 'APPLY_FILTERS':
            return { ...state, appliedFilters: { ...state.filters }, currentPage: 1 };
        case 'SET_PAGE':
            return { ...state, currentPage: action.payload };
        case 'CYCLE_SORT':
            return { ...state, sortIndex: (state.sortIndex + 1) % action.payload.totalOptions, currentPage: 1 };
        default:
            return state;
    }
};

export const useCatalogLogic = ({ itemsPerPage = ITEMS_PER_PAGE }: UseCatalogLogicParams) => {
    const { t } = useLocale();
    const [searchParams] = useSearchParams();
    const config: CatalogConfig = useMemo(() => getCatalogConfig(t), [t]);

    // Smooth loading state for initial mount
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    const initialFilters: FilterState = useMemo(() => ({
        seasons: [], genres: [], studios: [], selections: [],
        yearRange: { min: config.yearRange.min, max: config.yearRange.max }, searchQuery: ''
    }), [config]);

    const initialState: CatalogState = useMemo(() => ({
        filters: initialFilters,
        appliedFilters: initialFilters,
        sortIndex: 0,
        currentPage: 1
    }), [initialFilters]);

    const [state, dispatch] = useReducer(catalogReducer, initialState);

    const { data: rawCatalogData, isLoading: isQueryLoading, error, isPlaceholderData } = useQuery({
      queryKey: [QueryKey.FullCatalog, state.appliedFilters], 
      queryFn: animeService.getFullCatalog,
      staleTime: 1000 * 60 * 5,
      placeholderData: keepPreviousData
    });

    useEffect(() => {
        const selection = searchParams.get('selection') as CatalogSelection;
        const genre = searchParams.get('genre');
        const studio = searchParams.get('studio');
        const year = searchParams.get('year');
        const query = searchParams.get('query');
        if (selection || genre || studio || year || query) {
            dispatch({ 
                type: 'SYNC_PARAMS', 
                payload: { 
                    selection, 
                    genre: genre || undefined, 
                    studio: studio || undefined, 
                    year: year ? parseInt(year) : undefined, 
                    query: query || undefined 
                } 
            });
        }
    }, [searchParams]);

    const [paginatedData, setPaginatedData] = useState({ pagedItems: [] as any[], totalPages: 0, totalCount: 0 });
    const [isFilteringAsync, setIsFilteringAsync] = useState(false);

    // Stable empty array to avoid reference changes when rawCatalogData is undefined
    const EMPTY_ARRAY = useMemo(() => [], []);
    const rawCatalog = rawCatalogData || EMPTY_ARRAY;

    useEffect(() => {
        const controller = new AbortController();
        setIsFilteringAsync(true);

        if (!rawCatalog || rawCatalog.length === 0) {
            setPaginatedData({ pagedItems: [], totalPages: 0, totalCount: 0 });
            setIsFilteringAsync(false);
            return;
        }

        filterAndPaginateCatalogAsync(
            rawCatalog,
            state.appliedFilters,
            state.sortIndex,
            config,
            itemsPerPage,
            state.currentPage,
            t,
            controller.signal
        ).then(result => {
            setPaginatedData(result);
            setIsFilteringAsync(false);
        }).catch(err => {
            if (err.message !== 'Aborted') {
                console.error(err);
                setIsFilteringAsync(false);
            }
        });

        return () => controller.abort();
    }, [rawCatalog, state.appliedFilters, state.sortIndex, state.currentPage, itemsPerPage, t, config]);

    const { pagedItems, totalPages, totalCount } = paginatedData;

    const isLoading = isInitialLoading || (isQueryLoading && !isPlaceholderData) || isFilteringAsync;

    const actions = {
        toggleSelection: (list: CatalogFilterType, item: string | CatalogSelection, applyImmediately: boolean = false) => 
            dispatch({ type: 'TOGGLE_FILTER', payload: { list, item, applyImmediately } }),
        setYearRange: (range: { min: number, max: number }) => dispatch({ type: 'SET_YEAR_RANGE', payload: range }),
        setSearchQuery: (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
        resetFilters: () => dispatch({ type: 'RESET_FILTERS', payload: { defaultYearRange: config.yearRange } }),
        applyFilters: () => dispatch({ type: 'APPLY_FILTERS' }),
        cycleSort: () => dispatch({ type: 'CYCLE_SORT', payload: { totalOptions: config.sortOptions.length } }),
        setPage: (page: number) => dispatch({ type: 'SET_PAGE', payload: page })
    };


    return {
        state: {
            isLoading,
            error,
            visibleItems: pagedItems,
            totalPages,
            currentPage: state.currentPage,
            totalCount,
            filters: state.filters, 
            currentSort: config.sortOptions[state.sortIndex],
            config,
            hasResults: pagedItems.length > 0,
            placeholdersCount: itemsPerPage
        },
        actions
    };
};
