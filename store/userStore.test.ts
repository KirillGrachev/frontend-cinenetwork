import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { UserProfileData } from '../types';
import { UserRole, VideoQuality } from '../types';

const getUserProfileMock = vi.fn<(id?: string | number) => Promise<UserProfileData>>();
vi.mock('../services/apiService', () => ({
    userService: {
        getUserProfile: (id?: string | number) => getUserProfileMock(id),
        getUserSettings: vi.fn(),
    },
}));

import { useUserStore } from './userStore';

const profile: UserProfileData = {
    id: 1,
    username: 'tester',
    email: 't@e.st',
    isPremium: false,
    role: UserRole.User,
    preferences: { autoplay: false, quality: VideoQuality.Q1080p, notifications: true },
    joinDate: '2024-01-01',
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    stats: {
        totalWatchedEpisodes: 0,
        totalTitles: 0,
        daysWatched: 0,
        commentsCount: 0,
        reviewsCount: 0,
        averageScore: 0,
    },
    viewingDynamics: [],
    achievements: [],
    recentActivity: [],
    friends: [],
    collections: [],
    ratedAnime: [],
    comments: [],
};

describe('userStore', () => {
    beforeEach(() => {
        useUserStore.setState({ user: null, isAuthenticated: false, isLoading: false });
        getUserProfileMock.mockReset();
    });

    it('login/logout manage the session state', () => {
        useUserStore.getState().login(profile);
        expect(useUserStore.getState().isAuthenticated).toBe(true);
        expect(useUserStore.getState().user?.username).toBe('tester');

        useUserStore.getState().logout();
        expect(useUserStore.getState().isAuthenticated).toBe(false);
        expect(useUserStore.getState().user).toBeNull();
    });

    it('updateUser merges partial updates without losing fields', () => {
        useUserStore.getState().login(profile);
        useUserStore.getState().updateUser({ username: 'renamed' });

        const user = useUserStore.getState().user;
        expect(user?.username).toBe('renamed');
        expect(user?.email).toBe('t@e.st');
    });

    it('updateUser is a no-op when logged out', () => {
        useUserStore.getState().updateUser({ username: 'ghost' });
        expect(useUserStore.getState().user).toBeNull();
    });

    it('updatePreferences merges only the preferences subtree', () => {
        useUserStore.getState().login(profile);
        useUserStore.getState().updatePreferences({ autoplay: true });

        const prefs = useUserStore.getState().user?.preferences;
        expect(prefs).toEqual({
            autoplay: true,
            quality: VideoQuality.Q1080p,
            notifications: true,
        });
    });

    describe('syncUser', () => {
        it('does nothing for anonymous visitors', async () => {
            await useUserStore.getState().syncUser();
            expect(getUserProfileMock).not.toHaveBeenCalled();
        });

        it('replaces the persisted profile with the server copy', async () => {
            useUserStore.getState().login(profile);
            getUserProfileMock.mockResolvedValue({
                ...profile,
                username: 'from-server',
                level: 42,
            });

            await useUserStore.getState().syncUser();

            expect(getUserProfileMock).toHaveBeenCalledWith('me');
            expect(useUserStore.getState().user?.username).toBe('from-server');
            expect(useUserStore.getState().user?.level).toBe(42);
            expect(useUserStore.getState().isLoading).toBe(false);
        });

        it('keeps the local profile when the backend fails', async () => {
            useUserStore.getState().login(profile);
            getUserProfileMock.mockRejectedValue(new Error('offline'));

            await useUserStore.getState().syncUser();

            expect(useUserStore.getState().user?.username).toBe('tester');
            expect(useUserStore.getState().isLoading).toBe(false);
        });
    });
});
