
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FavoriteStatus, HistoryItem, VideoQuality, Anime } from '../types';

interface FavItem {
    status: FavoriteStatus;
    updatedAt: number;
}

interface AnimeState {
  // Map ID -> Metadata (Client state only, server state stays in React Query cache)
  favorites: Record<number, FavItem>;
  history: HistoryItem[];
  playerSettings: {
    volume: number;
    quality: VideoQuality;
    muted: boolean;
  };
  isSyncing: boolean;

  // Actions
  toggleFavorite: (animeOrId: Anime | number, status?: FavoriteStatus) => void;
  removeFromFavorites: (animeId: number) => void;
  addToHistory: (item: Omit<HistoryItem, 'timestamp'>) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  updatePlayerSettings: (settings: Partial<AnimeState['playerSettings']>) => void;
  
  // SWR Sync
  syncWithServer: () => Promise<void>;
}

export const useAnimeStore = create<AnimeState>()(
  persist(
    (set, get) => ({
      favorites: {},
      history: [],
      playerSettings: {
        volume: 0.8,
        quality: VideoQuality.Q1080p,
        muted: false,
      },
      isSyncing: false,

      toggleFavorite: (animeOrId, status = FavoriteStatus.Planned) => 
        set((state) => {
          const id = typeof animeOrId === 'number' ? animeOrId : animeOrId.id;
          const newFavorites = { ...state.favorites };
          // If status matches current, remove it (toggle off)
          if (newFavorites[id]?.status === status) {
            delete newFavorites[id];
          } else {
            newFavorites[id] = {
                status,
                updatedAt: Date.now()
            };
          }
          return { favorites: newFavorites };
        }),

      removeFromFavorites: (animeId) =>
        set((state) => {
          const newFavorites = { ...state.favorites };
          delete newFavorites[animeId];
          return { favorites: newFavorites };
        }),

      addToHistory: (item) =>
        set((state) => {
          const timestamp = Date.now();
          const filteredHistory = state.history.filter(h => h.id !== item.id);
          const newEntry = { ...item, timestamp, lastWatchedAt: new Date().toISOString() };
          
          return {
            history: [newEntry, ...filteredHistory].slice(0, 100)
          };
        }),

      removeFromHistory: (id) => 
        set((state) => ({
            history: state.history.filter(item => item.id !== id)
        })),

      clearHistory: () => set({ history: [] }),

      updatePlayerSettings: (newSettings) =>
        set((state) => ({
          playerSettings: { ...state.playerSettings, ...newSettings }
        })),

      syncWithServer: async () => {
        if (get().isSyncing) return;
        set({ isSyncing: true });
        
        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Fake network delay
            
            // Mock Remote Data
            // In a real app, this would be an array of { animeId, status, animeData... }
            // For now, we just simulate successful sync without merging new mock items to avoid complexity in this demo
            
            console.log('Synced anime data with server (Mock)');
        } catch (e) {
            console.error('Sync failed', e);
        } finally {
            set({ isSyncing: false });
        }
      }
    }),
    {
      name: 'cine-network-anime-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
          favorites: state.favorites, 
          history: state.history, 
          playerSettings: state.playerSettings 
      }),
    }
  )
);
