
import { useReducer, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { animeService, collectionService } from '../services/apiService';
import { Anime, FavoriteStatus, FILTER_ALL, QueryKey, FavoriteTab } from '../types';
import { useAnimeStore } from '../store/animeStore';

export interface AnimeWithStatus extends Anime {
    status: FavoriteStatus;
}

interface FavoritesState {
    activeCategory: typeof FILTER_ALL | FavoriteStatus;
    activeTab: FavoriteTab;
}

type FavoritesAction =
    | { type: 'SET_CATEGORY'; payload: typeof FILTER_ALL | FavoriteStatus }
    | { type: 'SET_TAB'; payload: FavoriteTab };

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
    switch (action.type) {
        case 'SET_CATEGORY':
            return { ...state, activeCategory: action.payload };
        case 'SET_TAB':
            return { ...state, activeTab: action.payload };
        default:
            return state;
    }
};

export const useFavoritesLogic = () => {
  const favoriteMap = useAnimeStore((state) => state.favorites);

  const [state, dispatch] = useReducer(favoritesReducer, {
      activeCategory: FILTER_ALL,
      activeTab: FavoriteTab.Anime,
  });

  /** React Query as single source of truth for server favorites & catalog data */
  const { data: favoritesRaw, isLoading: isFavoritesLoading, error: favoritesError } = useQuery({
      queryKey: [QueryKey.Favorites],
      queryFn: animeService.getFavorites,
      staleTime: 1000 * 60 * 5,
  });

  const { data: catalogRaw } = useQuery({
      queryKey: [QueryKey.FullCatalog],
      queryFn: animeService.getFullCatalog,
      staleTime: 1000 * 60 * 5,
  });

  /** React Query for collections */
  const { data: collectionsRaw, isLoading: isCollectionsLoading, error: collectionsError } = useQuery({
      queryKey: [QueryKey.Collections],
      queryFn: collectionService.getCollections,
      staleTime: 1000 * 60 * 5,
  });

  const itemsWithStatus: AnimeWithStatus[] = useMemo(() => {
      const serverItems = favoritesRaw || [];
      const catalogItems = catalogRaw || [];
      const catalogMap = new Map(catalogItems.map(a => [a.id, a]));

      const allAnimeMap = new Map<number, AnimeWithStatus>();

      // First load server favorites
      serverItems.forEach(anime => {
          const clientMeta = favoriteMap[anime.id];
          const status = clientMeta ? clientMeta.status : FavoriteStatus.Planned;
          allAnimeMap.set(anime.id, { ...anime, status });
      });

      // Merge local store status overrides/additions using React Query server data
      Object.entries(favoriteMap).forEach(([idStr, meta]) => {
          const animeId = Number(idStr);
          const animeData = allAnimeMap.get(animeId) || catalogMap.get(animeId);
          if (animeData) {
              allAnimeMap.set(animeId, { ...animeData, status: meta.status });
          }
      });

      return Array.from(allAnimeMap.values());
  }, [favoritesRaw, catalogRaw, favoriteMap]);

  const filteredItems = useMemo(() => {
      if (state.activeTab === FavoriteTab.Anime) {
          return itemsWithStatus.filter(item => {
              return state.activeCategory === FILTER_ALL || item.status === state.activeCategory;
          });
      } else {
          return collectionsRaw || [];
      }
  }, [itemsWithStatus, collectionsRaw, state.activeCategory, state.activeTab]);

  const actions = {
      setActiveCategory: (category: typeof FILTER_ALL | FavoriteStatus) => 
          dispatch({ type: 'SET_CATEGORY', payload: category }),
      setActiveTab: (tab: FavoriteTab) => 
          dispatch({ type: 'SET_TAB', payload: tab }),
      setPage: (page: number) => {}
  };

  return {
      state: {
          items: filteredItems,
          isLoading: state.activeTab === FavoriteTab.Collections ? isCollectionsLoading : isFavoritesLoading,
          error: state.activeTab === FavoriteTab.Collections ? collectionsError : favoritesError,
          activeCategory: state.activeCategory,
          activeTab: state.activeTab,
          totalPages: 1,
          currentPage: 1,
          placeholdersCount: 0
      },
      actions
  };
};
