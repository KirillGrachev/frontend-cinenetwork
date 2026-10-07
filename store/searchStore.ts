
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SearchCategory } from '../types';

interface SearchState {
  isSearchOpen: boolean;
  searchQuery: string;
  searchCategory: SearchCategory;
  recentSearches: string[];
  
  setSearchQuery: (query: string) => void;
  setSearchCategory: (category: SearchCategory) => void;
  toggleSearchOpen: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      isSearchOpen: false,
      searchQuery: '',
      searchCategory: SearchCategory.Anime,
      recentSearches: [],

      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setSearchCategory: (category) => set({ searchCategory: category }),
      
      toggleSearchOpen: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

      addRecentSearch: (query) => 
        set((state) => {
            const trimmed = query.trim();
            if (!trimmed) return state;
            // Remove duplicates and keep top 5
            const newHistory = [trimmed, ...state.recentSearches.filter(s => s !== trimmed)].slice(0, 5);
            return { recentSearches: newHistory };
        }),

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'cine-network-search',
      storage: createJSONStorage(() => localStorage),
      // Persist only recentSearches, other state is transient
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);
