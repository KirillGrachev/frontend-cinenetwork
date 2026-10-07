
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { userService } from '../services/apiService';
import { QueryKey, UserProfileData } from '../types';
import { useAuth } from '../context/AuthContext';
import { useUserStore } from '../store/userStore';

export const useProfileLogic = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth(); // Get current logged in user (from Store)
  const syncUser = useUserStore((state) => state.syncUser);

  // Determine if viewing own profile
  const isOwnProfile = !id || (user && String(user.id) === id);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: [QueryKey.UserProfile, id || 'me'],
    queryFn: async () => {
        // If own profile, trigger background sync but don't block
        if (isOwnProfile) {
            syncUser(); 
            // If store has profile data, return it immediately if query is fetching?
            // React Query will handle stale-while-revalidate for us if we use initialData
            // However, since we have a custom store, we can merge logic.
            // For now, let's stick to standard API fetch for consistency, 
            // relying on the fact that 'syncUser' updates the store which 'useAuth' consumes.
            
            // Actually, if we want TRUE SWR from local store:
            // We should use the store data if available.
            return userService.getUserProfile('me');
        }
        return userService.getUserProfile(id);
    },
    // Use store data as initial data for own profile to render instantly
    initialData: isOwnProfile && (user as UserProfileData)?.stats ? (user as UserProfileData) : undefined,
    staleTime: 1000 * 60 * 2, // 2 mins
  });

  return {
      state: {
          profile,
          isLoading: isOwnProfile && profile ? false : isLoading, // If we have profile from store, we are not "loading" visually
          error,
          isOwnProfile
      }
  };
};
