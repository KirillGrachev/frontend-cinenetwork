import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';
import { apiService } from '../services/apiService';
import type { Anime, Collection, NewsItem, SearchFilters } from '../types';
import { SearchCategory, QueryKey, AppRoute } from '../types';
import { useLocale } from '../context/LocaleContext';

export interface SearchResultViewModel {
    id: number;
    title: string;
    subtitle: string;
    image: string | null;
    rating?: number;
    type: SearchCategory;
    icon?: string;
}

export const useSearchResultsLogic = (
    query: string,
    category: SearchCategory,
    filters: SearchFilters,
    onOpenPost: (id: number) => void,
    onNavigate: (path: string) => void,
    onClose: () => void,
) => {
    const { t } = useLocale();
    const debouncedQuery = useDebounce(query, 300);
    const [isExpanded, setIsExpanded] = useState(false);

    // Collapse the popup whenever the result-set identity changes
    // (render-phase adjustment instead of a syncing effect).
    const resetKey = `${debouncedQuery}|${category}|${JSON.stringify(filters)}`;
    const [prevResetKey, setPrevResetKey] = useState(resetKey);
    if (resetKey !== prevResetKey) {
        setPrevResetKey(resetKey);
        setIsExpanded(false);
    }

    const hasActiveFilters = Object.values(filters).some((v) => !!v);
    const searchAttempted = debouncedQuery.trim().length > 0 || hasActiveFilters;

    const {
        data: results,
        isLoading,
        error,
    } = useQuery({
        queryKey: [QueryKey.SearchResults, debouncedQuery, category, filters],
        queryFn: () => apiService.search(debouncedQuery, category, filters),
        enabled: searchAttempted,
    });

    /**
     * `apiService.search` overloads guarantee the array element type per
     * category; the single cast per branch is the narrowing boundary.
     */
    const viewModels: SearchResultViewModel[] = useMemo(() => {
        if (!results) return [];

        switch (category) {
            case SearchCategory.Anime:
                return (results as Anime[]).map((anime) => ({
                    id: anime.id,
                    title: t(anime.title),
                    subtitle: `${anime.year}, ${t(`genres.${anime.genres[0]}`)}`,
                    image: anime.thumbnailUrl,
                    rating: anime.rating,
                    type: SearchCategory.Anime,
                }));
            case SearchCategory.News:
                return (results as NewsItem[]).map((news) => ({
                    id: news.id,
                    title: t(news.title),
                    subtitle: news.date,
                    image: null,
                    type: SearchCategory.News,
                    icon: 'fa-newspaper',
                }));
            case SearchCategory.Collections:
                return (results as Collection[]).map((col) => ({
                    id: col.id,
                    title: t(col.title),
                    subtitle: t('collections.animeCount', { count: col.count }),
                    image: null,
                    type: SearchCategory.Collections,
                    icon: 'fa-layer-group',
                }));
            default:
                return [];
        }
    }, [results, category, t]);

    const handleItemClick = (item: SearchResultViewModel) => {
        if (item.type === SearchCategory.Anime) {
            onNavigate(`/anime/${item.id}`);
        } else if (item.type === SearchCategory.News) {
            onOpenPost(item.id);
        } else if (item.type === SearchCategory.Collections) {
            onNavigate(AppRoute.Collections);
        }
        onClose();
    };

    const displayedItems = isExpanded ? viewModels : viewModels.slice(0, 3);
    const hasMore = viewModels.length > 3;

    return {
        state: {
            items: displayedItems,
            hasMore,
            isLoading,
            isNoResults: !isLoading && searchAttempted && results?.length === 0,
            error,
            isExpanded,
        },
        actions: {
            expand: () => setIsExpanded(true),
            handleClick: handleItemClick,
        },
    };
};
