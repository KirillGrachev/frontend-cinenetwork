
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserSettings, UserProfileData } from '../types';
import { userService } from '../services/apiService';

// Allow the store to hold either basic settings or full profile data
type UserStateData = UserSettings | UserProfileData;

interface UserState {
  user: UserStateData | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (user: UserStateData) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserStateData>) => void;
  updatePreferences: (prefs: Partial<UserSettings['preferences']>) => void;
  
  // SWR Sync
  syncUser: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user) => set({ user, isAuthenticated: true }),
      
      logout: () => set({ user: null, isAuthenticated: false }),

      updateUser: (updates) => 
        set((state) => {
            if (!state.user) return state;
            return { user: { ...state.user, ...updates } as UserStateData };
        }),

      updatePreferences: (prefs) =>
        set((state) => {
            if (!state.user) return state;
            return {
                user: {
                    ...state.user,
                    preferences: { ...state.user.preferences, ...prefs }
                } as UserStateData
            };
        }),

      syncUser: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) return;

        set({ isLoading: true });
        try {
            // Fetch FULL profile to populate profile page instantly
            const remoteProfile = await userService.getUserProfile('me');
            set({ user: remoteProfile });
        } catch (error) {
            console.error('User sync failed:', error);
        } finally {
            set({ isLoading: false });
        }
      }
    }),
    {
      name: 'cine-network-user',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
          user: state.user, 
          isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
