import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfileData } from '../types';
import { userService } from '../services/apiService';
import { getAuthToken, clearAuthToken } from '../services/authToken';

interface UserState {
    user: UserProfileData | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (user: UserProfileData) => void;
    logout: () => void;
    updateUser: (updates: Partial<UserProfileData>) => void;
    updatePreferences: (prefs: Partial<UserProfileData['preferences']>) => void;

    /** Stale-while-revalidate: refresh the persisted profile from the backend. */
    syncUser: () => Promise<void>;
}

/**
 * Session store.
 *
 * The previous version typed `user` as `UserSettings | UserProfileData` and
 * papered over the union with `as` casts on every update. `UserProfileData`
 * extends `UserSettings`, so a single type removes the casts entirely.
 *
 * SECURITY NOTE: persisting `isAuthenticated` in localStorage is acceptable
 * only for this mock demo. With a real backend the session must be derived
 * from an httpOnly cookie / refresh token — a localStorage flag can be
 * flipped from devtools and would grant UI-level "auth" regardless.
 */
export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: (user) => set({ user, isAuthenticated: true }),

            logout: () => set({ user: null, isAuthenticated: false }),

            updateUser: (updates) =>
                set((state) => (state.user ? { user: { ...state.user, ...updates } } : state)),

            updatePreferences: (prefs) =>
                set((state) =>
                    state.user
                        ? {
                              user: {
                                  ...state.user,
                                  preferences: { ...state.user.preferences, ...prefs },
                              },
                          }
                        : state,
                ),

            syncUser: async () => {
                if (!get().isAuthenticated || get().isLoading) return;

                set({ isLoading: true });
                try {
                    const remoteProfile = await userService.getUserProfile('me');
                    set({ user: remoteProfile });
                } catch (error) {
                    // Keep the persisted profile on failure; surface via console
                    // only — a background sync must never break the session.
                    console.error('User sync failed:', error);
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'cine-network-user',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            /**
             * Session integrity: the persisted `isAuthenticated` flag is
             * meaningless without a token (localStorage can be flipped by
             * hand). Runs synchronously during hydration — before any
             * component renders — so guards never see a tampered session.
             */
            onRehydrateStorage: () => (state) => {
                if (state?.isAuthenticated && !getAuthToken()) {
                    clearAuthToken();
                    state.logout();
                }
            },
        },
    ),
);
