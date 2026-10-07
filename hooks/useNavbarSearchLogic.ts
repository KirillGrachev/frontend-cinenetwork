
import { useState } from 'react';
import { SearchFilters, SearchCategory } from '../types';
import { useLocale } from '../context/LocaleContext';
import { getCatalogConfig } from '../constants';
import { useSearchStore } from '../store/searchStore';

export const useNavbarSearchLogic = (
    setIsFilterMenuOpen: (isOpen: boolean) => void
) => {
  const { t } = useLocale();
  const CATALOG_CONFIG = getCatalogConfig(t);
  
  /** Consume store directly (State Collocation) */
  const { 
      searchQuery, 
      setSearchQuery, 
      searchCategory, 
      setSearchCategory,
      addRecentSearch,
      recentSearches
  } = useSearchStore();

  /** Local state for filters, as they might be transient before applying */
  const [filters, setFilters] = useState<SearchFilters>({});

  const actions = {
      updateFilter: (key: keyof SearchFilters, value: string) => {
          setFilters({ ...filters, [key]: value });
      },
      handleApplyFilters: (close: () => void) => {
          // Save query to history if present
          if (searchQuery) addRecentSearch(searchQuery);
          // Close the popover via the callback
          close();
      },
      setSearchQuery,
      setSearchCategory,
      setFilters /** Expose setter if needed */
  };

  const categories: {id: SearchCategory, label: string, icon: string}[] = [
      { id: SearchCategory.Anime, label: t('navbar.searchCategoryLabels.anime'), icon: 'fa-solid fa-film' },
      { id: SearchCategory.Collections, label: t('navbar.searchCategoryLabels.collections'), icon: 'fa-solid fa-layer-group' },
      { id: SearchCategory.News, label: t('navbar.searchCategoryLabels.news'), icon: 'fa-solid fa-newspaper' },
  ];

  return {
      state: {
          t,
          CATALOG_CONFIG,
          categories,
          searchQuery,
          searchCategory,
          filters,
          recentSearches
      },
      actions
  };
};
