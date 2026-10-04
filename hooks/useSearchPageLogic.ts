import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiService } from '../services/apiService';
import type { SearchCategory } from '../types';
import { QueryKey } from '../types';

export const useSearchPageLogic = (query: string, category: SearchCategory) => {
    const {
        data: results,
        isLoading,
        error,
        isPlaceholderData,
    } = useQuery({
        queryKey: [QueryKey.SearchPage, query, category],
        queryFn: () => apiService.search(query, category),
        enabled: !!query.trim() /** Only run if there's a query */,
        staleTime: 1000 * 60 /** Cache search results for 1 minute */,
        placeholderData:
            keepPreviousData /** SWR: Keep previous search results while new query fetches */,
    });

    return {
        state: {
            results: results || [],
            isLoading: isLoading && !isPlaceholderData,
            error,
            hasResults: !!results && results.length > 0,
        },
    };
};
