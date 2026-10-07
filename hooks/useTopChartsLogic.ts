
import { useReducer, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { animeService } from '../services/apiService';
import { TopPeriod, TopMetric, Anime, QueryKey } from '../types';
import { useLocale } from '../context/LocaleContext';

export interface AnimeWithViews extends Anime {
    views: number;
}

interface TopChartsState {
    period: TopPeriod;
    metric: TopMetric;
}

type TopChartsAction = 
    | { type: 'SET_PERIOD'; payload: TopPeriod }
    | { type: 'SET_METRIC'; payload: TopMetric };

const topChartsReducer = (state: TopChartsState, action: TopChartsAction): TopChartsState => {
    switch (action.type) {
        case 'SET_PERIOD':
            return { ...state, period: action.payload };
        case 'SET_METRIC':
            return { ...state, metric: action.payload };
        default:
            return state;
    }
};

export const useTopChartsLogic = () => {
    const { t } = useLocale();
    
    const [state, dispatch] = useReducer(topChartsReducer, {
        period: TopPeriod.Week,
        metric: TopMetric.Views
    });

    // Reuse existing catalog data but key it by params for SWR
    const { data: rawCatalog, isLoading, error, isPlaceholderData } = useQuery({
        queryKey: [QueryKey.FullCatalog, state.period, state.metric],
        queryFn: animeService.getFullCatalog,
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData
    });

    const items = useMemo(() => {
        if (!rawCatalog) return [];
        
        // Mock logic: Shuffle data deterministically based on selected period
        // to simulate different charts for week/month/year
        const seed = state.period === TopPeriod.Week ? 1 : 
                     state.period === TopPeriod.Month ? 2 : 
                     state.period === TopPeriod.Year ? 3 : 4;
        
        // Enhance with mock views since base Anime type doesn't have it
        const enhancedCatalog: AnimeWithViews[] = rawCatalog.map(anime => ({
            ...anime,
            // Deterministic mock views based on ID and seed
            views: 100000 + ((anime.id * 7543 + seed * 12345) % 900000)
        }));
                     
        return enhancedCatalog.sort((a, b) => {
            if (state.metric === TopMetric.Rating) {
                // Secondary sort by title if ratings are equal
                if (b.rating === a.rating) return t(a.title).localeCompare(t(b.title));
                return b.rating - a.rating;
            } else {
                // Sort by views
                return b.views - a.views;
            }
        });
    }, [rawCatalog, state.period, state.metric, t]);

    const actions = {
        setPeriod: (period: TopPeriod) => dispatch({ type: 'SET_PERIOD', payload: period }),
        setMetric: (metric: TopMetric) => dispatch({ type: 'SET_METRIC', payload: metric }),
    };

    return {
        state: {
            items,
            isLoading: isLoading && !isPlaceholderData,
            error,
            period: state.period,
            metric: state.metric
        },
        actions
    };
};
