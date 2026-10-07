import React, { useState, useEffect } from 'react';
import { SearchFilters } from '../types';

export const useNavbarDesktopLogic = (
    isSearchOpen: boolean, 
    searchQuery: string,
    searchInputRef: React.RefObject<HTMLInputElement | null>
) => {
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  useEffect(() => {
    /** Show results if there is a query OR filters are active */
    /** BUT only if the filter menu is CLOSED (user finished configuring) */
    const hasFilters = searchFilters.genre || searchFilters.studio || searchFilters.year;
    
    if (isSearchOpen && !isFilterMenuOpen && (searchQuery.trim().length > 0 || hasFilters)) {
      setIsResultsVisible(true);
    } else {
      setIsResultsVisible(false);
    }
  }, [isSearchOpen, searchQuery, searchFilters, isFilterMenuOpen]);

  const actions = {
      closeResults: () => setIsResultsVisible(false),
      setFilters: setSearchFilters,
      setIsFilterMenuOpen: setIsFilterMenuOpen,
      handleSearchSubmit: (e: React.FormEvent) => {
        e.preventDefault();
        if(searchInputRef.current) searchInputRef.current.blur();
        setIsFilterMenuOpen(false);
      }
  };

  return {
      state: {
          isResultsVisible,
          searchFilters,
          isFilterMenuOpen
      },
      actions
  };
};