import type React from 'react';
import { useState } from 'react';
import type { SearchFilters } from '../types';

export const useNavbarDesktopLogic = (
    isSearchOpen: boolean,
    searchQuery: string,
    searchInputRef: React.RefObject<HTMLInputElement | null>,
) => {
    const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    /** Identity of a result set the user explicitly dismissed via closeResults. */
    const [dismissedKey, setDismissedKey] = useState<string | null>(null);

    const hasFilters = Boolean(searchFilters.genre || searchFilters.studio || searchFilters.year);

    /**
     * Derived visibility (no effect): results show when the search UI is open,
     * the filter menu is closed and there is something to search for — unless
     * the user dismissed exactly this result set. Any change to the inputs
     * produces a new key, so new results re-appear automatically.
     */
    const resultsKey = `${isSearchOpen}|${searchQuery}|${isFilterMenuOpen}|${searchFilters.genre ?? ''}|${searchFilters.studio ?? ''}|${searchFilters.year ?? ''}`;
    const isResultsVisible =
        isSearchOpen &&
        !isFilterMenuOpen &&
        (searchQuery.trim().length > 0 || hasFilters) &&
        dismissedKey !== resultsKey;

    const actions = {
        closeResults: () => setDismissedKey(resultsKey),
        setFilters: setSearchFilters,
        setIsFilterMenuOpen: setIsFilterMenuOpen,
        handleSearchSubmit: (e: React.FormEvent) => {
            e.preventDefault();
            if (searchInputRef.current) searchInputRef.current.blur();
            setIsFilterMenuOpen(false);
        },
    };

    return {
        state: {
            isResultsVisible,
            searchFilters,
            isFilterMenuOpen,
        },
        actions,
    };
};
