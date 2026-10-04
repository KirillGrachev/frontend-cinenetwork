import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FavoriteStatus, VideoQuality } from '../types';
import type { Anime, HistoryItem } from '../types';

interface FavItem {
    status: FavoriteStatus;
    updatedAt: number;
}

/** Fields the caller must provide; timestamps are owned by the store. */
export type NewHistoryItem = Omit<HistoryItem, 'timestamp' | 'lastWatchedAt'>;

/** Hard cap for the persisted watch history (oldest entries are dropped). */
const HISTORY_LIMIT = 100;

interface AnimeState {
    /** Client-side state only — server state lives in the React Query cache. */
    favorites: Record<number, FavItem>;
    history: HistoryItem[];
    playerSettings: {
        volume: number;
        quality: VideoQuality;
        muted: boolean;
    };

    toggleFavorite: (animeOrId: Anime | number, status?: FavoriteStatus) => void;
    removeFromFavorites: (animeId: number) => void;
    addToHistory: (item: NewHistoryItem) => void;
    removeFromHistory: (id: string) => void;
    clearHistory: () => void;
    updatePlayerSettings: (settings: Partial<AnimeState['playerSettings']>) => void;
}

/**
 * NOTE: the former `syncWithServer()` was a stub that awaited a fake
 * 800 ms timer and logged to the console. Pretending to sync is worse than
 * not syncing: it hides the fact that no reconciliation exists. Real
 * favorites/history reconciliation requires an authenticated backend and
 * belongs into React Query mutations; until then the persisted local state
 * is the source of truth and this store stays purely client-side.
 */
export const useAnimeStore = create<AnimeState>()(
    persist(
        (set) => ({
            favorites: {},
            history: [],
            playerSettings: {
                volume: 0.8,
                quality: VideoQuality.Q1080p,
                muted: false,
            },

            toggleFavorite: (animeOrId, status = FavoriteStatus.Planned) =>
                set((state) => {
                    const id = typeof animeOrId === 'number' ? animeOrId : animeOrId.id;
                    const newFavorites = { ...state.favorites };
                    if (newFavorites[id]?.status === status) {
                        delete newFavorites[id];
                    } else {
                        newFavorites[id] = { status, updatedAt: Date.now() };
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
                    const now = Date.now();
                    const newEntry: HistoryItem = {
                        ...item,
                        timestamp: now,
                        lastWatchedAt: new Date(now).toISOString(),
                    };
                    return {
                        history: [newEntry, ...state.history.filter((h) => h.id !== item.id)].slice(
                            0,
                            HISTORY_LIMIT,
                        ),
                    };
                }),

            removeFromHistory: (id) =>
                set((state) => ({
                    history: state.history.filter((item) => item.id !== id),
                })),

            clearHistory: () => set({ history: [] }),

            updatePlayerSettings: (newSettings) =>
                set((state) => ({
                    playerSettings: { ...state.playerSettings, ...newSettings },
                })),
        }),
        {
            name: 'cine-network-anime-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                favorites: state.favorites,
                history: state.history,
                playerSettings: state.playerSettings,
            }),
        },
    ),
);
