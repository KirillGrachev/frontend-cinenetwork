import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { userService } from '../services/apiService';
import { QueryKey } from '../types';
import { useAuth } from '../context/AuthContext';
import { useUserStore } from '../store/userStore';

export const useProfileLogic = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth(); // Get current logged in user (from Store)
    const syncUser = useUserStore((state) => state.syncUser);

    // Determine if viewing own profile (strictly boolean)
    const isOwnProfile = !id || (user !== null && String(user.id) === id);

    const {
        data: profile,
        isLoading,
        error,
    } = useQuery({
        queryKey: [QueryKey.UserProfile, id || 'me'],
        queryFn: () => userService.getUserProfile(isOwnProfile ? 'me' : id),
        // Use persisted store profile as initial data so own profile paints instantly
        initialData: isOwnProfile && user?.stats ? user : undefined,
        staleTime: 1000 * 60 * 2, // 2 mins
    });

    /**
     * Background store sync for the own profile (SWR). Kept OUT of the queryFn:
     * a query function must stay a pure data fetch — firing store writes from
     * it made every refetch mutate global state as a side effect.
     */
    useEffect(() => {
        if (isOwnProfile) {
            void syncUser();
        }
    }, [isOwnProfile, syncUser]);

    return {
        state: {
            profile,
            isLoading: isOwnProfile && profile ? false : isLoading, // If we have profile from store, we are not "loading" visually
            error,
            isOwnProfile,
        },
    };
};
