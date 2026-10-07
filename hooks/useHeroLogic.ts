
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocale } from '../context/LocaleContext';
import { useToast } from '../context/ToastContext';
import { ToastType, FavoriteStatus, Anime } from '../types';
import { useAnimeStore } from '../store/animeStore';

export const useHeroLogic = (anime: Anime) => {
  const { t } = useLocale();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);
  
  // Use Global Store
  const favorites = useAnimeStore((state) => state.favorites);
  const toggleFavorite = useAnimeStore((state) => state.toggleFavorite);
  const isBookmarked = !!favorites[anime.id];

  const actions = {
      handleImageError: () => setHasError(true),
      handleWatch: () => {
          if (anime.id) {
              navigate(`/anime/${anime.id}`);
          }
      },
      handleWatchLater: () => {
          toggleFavorite(anime, FavoriteStatus.Planned);
          
          const nowBookmarked = !isBookmarked;
          showToast(
              nowBookmarked ? t('common.toasts.addedToFavorites') : t('common.toasts.removedFromFavorites'), 
              nowBookmarked ? ToastType.Success : ToastType.Info
          );
      }
  };

  return {
      state: {
          hasError,
          t,
          isBookmarked
      },
      actions
  };
};
