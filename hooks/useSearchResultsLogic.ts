import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';
import { apiService } from '../services/apiService';
import { Anime, Collection, NewsItem, SearchCategory, SearchFilters, QueryKey, AppRoute } from '../types';
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
    onClose: () => void
) => {
    const { t } = useLocale();
    const debouncedQuery = useDebounce(query, 300);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setIsExpanded(false);
    }, [debouncedQuery, category, filters]);

    const hasActiveFilters = Object.values(filters).some(v => !!v);
    const searchAttempted = debouncedQuery.trim().length > 0 || hasActiveFilters;

    const { data: results, isLoading, error } = useQuery({
        queryKey: [QueryKey.SearchResults, debouncedQuery, category, filters],
        queryFn: () => apiService.search(debouncedQuery, category, filters),
        enabled: searchAttempted,
    });

    const viewModels: SearchResultViewModel[] = useMemo(() => {
        if (!results) return [];

        return results.map((item: any) => {
            if (category === SearchCategory.Anime) {
                const anime = item as Anime;
                return {
                    id: anime.id,
                    title: t(anime.title),
                    subtitle: `${anime.year}, ${t(`genres.${anime.genres[0]}`)}`,
                    image: anime.thumbnailUrl,
                    rating: anime.rating,
                    type: SearchCategory.Anime
                };
            } else if (category === SearchCategory.News) {
                const news = item as NewsItem;
                return {
                    id: news.id,
                    title: t(news.title),
                    subtitle: news.date,
                    image: null,
                    type: SearchCategory.News,
                    icon: 'fa-newspaper'
                };
            } else {
                const col = item as Collection;
                return {
                    id: col.id,
                    title: t(col.title),
                    subtitle: t('collections.animeCount', { count: col.count }),
                    image: null,
                    type: SearchCategory.Collections,
                    icon: 'fa-layer-group'
                };
            }
        });
    }, [results, category, t]);

    const handleItemClick = (item: SearchResultViewModel) => {
        if (item.type === SearchCategory.Anime) {
             console.log('Open anime', item.id); /** Placeholder for anime details page */
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
            isExpanded
        },
        actions: {
            expand: () => setIsExpanded(true),
            handleClick: handleItemClick
        }
    };
};