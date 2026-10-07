
import { useReducer, useMemo, useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { animeService } from '../services/apiService';
import { getScheduleDays } from '../constants';
import { useLocale } from '../context/LocaleContext';
import { SortDirection, QueryKey } from '../types';

const ITEMS_PER_PAGE = 10;

interface ScheduleState {
    activeDay: string;
    sortOrder: SortDirection;
    currentPage: number;
}

type ScheduleAction =
    | { type: 'SET_DAY'; payload: string }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'TOGGLE_SORT' };

const scheduleReducer = (state: ScheduleState, action: ScheduleAction): ScheduleState => {
    switch (action.type) {
        case 'SET_DAY':
            return { ...state, activeDay: action.payload, currentPage: 1 };
        case 'SET_PAGE':
            return { ...state, currentPage: action.payload };
        case 'TOGGLE_SORT':
            return { 
                ...state, 
                sortOrder: state.sortOrder === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc,
                currentPage: 1
            };
        default:
            return state;
    }
};

export const useScheduleLogic = () => {
  const { t } = useLocale();
  const scheduleDays = useMemo(() => getScheduleDays(t), [t]);

  // Smooth loading state for initial mount
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
      const timer = setTimeout(() => {
          setIsInitialLoading(false);
      }, 600); // 600ms minimum load time for skeleton
      return () => clearTimeout(timer);
  }, []);

  /** Initial Day Logic */
  const getCurrentDayId = () => {
      const dayIndex = new Date().getDay();
      const map = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      return map[dayIndex];
  };

  const initialState: ScheduleState = {
      activeDay: getCurrentDayId(),
      sortOrder: SortDirection.Desc,
      currentPage: 1,
  };

  const [state, dispatch] = useReducer(scheduleReducer, initialState);

  /** Data Fetching */
  const { data: scheduleData, isLoading: isQueryLoading, error, isPlaceholderData } = useQuery({
    queryKey: [QueryKey.FullCatalog, state.activeDay], // Include activeDay for SWR behavior
    queryFn: animeService.getFullCatalog,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData
  });

  // Combined loading state: True if initial timer is running OR if query is legitimately loading (and not just refreshing with stale data)
  const isLoading = isInitialLoading || (isQueryLoading && !isPlaceholderData);

  /** Filtering & Sorting Logic */
  const { allFiltered, pagedItems, totalPages } = useMemo(() => {
    if (!scheduleData || scheduleData.length === 0) {
        return { allFiltered: [], pagedItems: [], totalPages: 0 };
    }
    
    /** Mock logic: filter by activeDay. Using full list for demo. */
    let filtered = [...scheduleData];
    
    if (state.sortOrder === SortDirection.Asc) {
        filtered.reverse();
    }

    const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const start = (state.currentPage - 1) * ITEMS_PER_PAGE;
    const paged = filtered.slice(start, start + ITEMS_PER_PAGE);

    return { 
        allFiltered: filtered, 
        pagedItems: paged, 
        totalPages: total 
    };
  }, [scheduleData, state.activeDay, state.sortOrder, state.currentPage]);

  /** Actions Facade */
  const actions = {
      setActiveDay: (dayId: string) => dispatch({ type: 'SET_DAY', payload: dayId }),
      toggleSort: () => dispatch({ type: 'TOGGLE_SORT' }),
      setPage: (page: number) => dispatch({ type: 'SET_PAGE', payload: page }),
  };

  return {
      state: {
          isLoading,
          error,
          activeDay: state.activeDay,
          sortOrder: state.sortOrder,
          scheduleDays,
          items: pagedItems, // Currently visible items
          totalItemsCount: allFiltered.length,
          totalPages: totalPages,
          currentPage: state.currentPage,
          placeholdersCount: 0
      },
      actions
  };
};
