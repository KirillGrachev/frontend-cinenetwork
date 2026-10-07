
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router';
import { animeService } from '../services/apiService';
import { useToast } from '../context/ToastContext';
import { useLocale } from '../context/LocaleContext';
import { ToastType, FavoriteStatus, AppRoute, QueryKey } from '../types';
import { useAnimeStore } from '../store/animeStore';

export const useAnimePageLogic = (id: number) => {
  const { t } = useLocale();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  /** Read active tab from URL, default to 'overview' */
  const activeTab = searchParams.get('tab') || 'overview';

  // Use Global Store for optimistic UI state
  const favorites = useAnimeStore((state) => state.favorites);
  const toggleFavorite = useAnimeStore((state) => state.toggleFavorite);
  const removeFromFavorites = useAnimeStore((state) => state.removeFromFavorites);
  const currentStatus = favorites[id]?.status || null;

  /** Ensure 'tab' is present in URL for consistent state */
  useEffect(() => {
      if (!searchParams.get('tab')) {
          setSearchParams(prev => {
              const newParams = new URLSearchParams(prev);
              newParams.set('tab', 'overview');
              return newParams;
          }, { replace: true });
      }
  }, [searchParams, setSearchParams]);

  const { data: anime, isLoading, error } = useQuery({
    queryKey: ['animeDetails', id],
    queryFn: () => animeService.getAnimeDetails(id),
    enabled: !!id,
  });

  const actions = {
      setActiveTab: (tab: string) => {
          setSearchParams(prev => {
              const newParams = new URLSearchParams(prev);
              newParams.set('tab', tab);
              if (tab !== 'episodes') newParams.delete('ep_page');
              return newParams;
          }, { replace: true });
      },
      
      updateStatus: (status: FavoriteStatus | null) => {
          if (!anime) return;
          
          if (status === null) {
              removeFromFavorites(anime.id);
          } else {
              toggleFavorite(anime, status);
          }
          queryClient.invalidateQueries({ queryKey: [QueryKey.Favorites] });

          if (status) {
              showToast(t(`common.toasts.statusUpdated`, { status: t(`favorites.tabs.${status}`) }), ToastType.Success);
          } else {
              showToast(t('common.toasts.removedFromFavorites'), ToastType.Info);
          }
      },

      playTrailer: () => {
          showToast(t('toasts.socialsUnavailable'), ToastType.Info);
      }
  };

  return {
      state: {
          anime,
          isLoading,
          error,
          activeTab,
          currentStatus
      },
      actions
  };
};
