import { useMemo, useCallback } from 'react';
import { HistoryClearPeriod } from '../types';
import { useAnimeStore } from '../store/animeStore';

export const useHistoryLogic = () => {
    const history = useAnimeStore((state) => state.history);
    const clearHistory = useAnimeStore((state) => state.clearHistory);

    const visibleItems = useMemo(() => {
        return [...history].sort((a, b) => b.timestamp - a.timestamp);
    }, [history]);

    const actions = {
        removeFromHistory: (id: string) => {
            useAnimeStore.setState((state) => ({
                history: state.history.filter((item) => item.id !== id),
            }));
        },
        clearHistoryByPeriod: useCallback(
            (period: HistoryClearPeriod) => {
                if (period === HistoryClearPeriod.AllTime) {
                    clearHistory();
                } else {
                    const now = Date.now();
                    const hour = 60 * 60 * 1000;
                    const day = 24 * hour;
                    const cutoff = period === HistoryClearPeriod.LastHour ? now - hour : now - day;

                    useAnimeStore.setState((state) => ({
                        history: state.history.filter((item) => item.timestamp < cutoff),
                    }));
                }
            },
            [clearHistory],
        ),
    };

    return {
        state: {
            isLoading: false,
            error: null,
            visibleItems,
            isEmpty: history.length === 0,
        },
        actions,
    };
};
