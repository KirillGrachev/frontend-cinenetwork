import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';
import { renderWithProviders, preloadDictionaries } from '../../tests/renderWithProviders';
import { RequireAuth, RequireRole } from './RouteGuards';
import { useUserStore } from '../../store/userStore';
import { setAuthToken, clearAuthToken } from '../../services/authToken';
import { UserRole, VideoQuality } from '../../types';
import type { UserProfileData } from '../../types';

const profile = (role: UserRole): UserProfileData => ({
    id: 1,
    username: 'guard-tester',
    email: 'g@t.st',
    isPremium: false,
    role,
    preferences: { autoplay: false, quality: VideoQuality.Q1080p, notifications: false },
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
});

const login = (role: UserRole) => {
    setAuthToken('test-token');
    useUserStore.getState().login(profile(role));
};

describe('RequireAuth', () => {
    beforeEach(() => {
        clearAuthToken();
        useUserStore.setState({ user: null, isAuthenticated: false, isLoading: false });
    });

    it('redirects anonymous visitors to /login, preserving the target', async () => {
        await preloadDictionaries();
        renderWithProviders(
            <Routes>
                <Route
                    path="/settings"
                    element={
                        <RequireAuth>
                            <div>secret settings</div>
                        </RequireAuth>
                    }
                />
                <Route path="/login" element={<div>login page</div>} />
            </Routes>,
            { route: '/settings' },
        );

        expect(await screen.findByText('login page')).toBeInTheDocument();
        expect(screen.queryByText('secret settings')).not.toBeInTheDocument();
    });

    it('renders children for an authenticated session with a token', async () => {
        login(UserRole.User);

        await renderWithProviders(
            <Routes>
                <Route
                    path="/settings"
                    element={
                        <RequireAuth>
                            <div>secret settings</div>
                        </RequireAuth>
                    }
                />
            </Routes>,
            { route: '/settings' },
        );

        expect(await screen.findByText('secret settings')).toBeInTheDocument();
    });
});

describe('RequireRole', () => {
    beforeEach(() => {
        clearAuthToken();
        useUserStore.setState({ user: null, isAuthenticated: false, isLoading: false });
    });

    it('redirects a regular user away from admin areas', async () => {
        login(UserRole.User);

        await renderWithProviders(
            <Routes>
                <Route
                    path="/admin/stats"
                    element={
                        <RequireRole roles={[UserRole.Admin, UserRole.Moderator]}>
                            <div>admin dashboard</div>
                        </RequireRole>
                    }
                />
                <Route path="/" element={<div>home page</div>} />
            </Routes>,
            { route: '/admin/stats' },
        );

        expect(await screen.findByText('home page')).toBeInTheDocument();
        expect(screen.queryByText('admin dashboard')).not.toBeInTheDocument();
    });

    it('renders for a moderator when moderators are allowed', async () => {
        login(UserRole.Moderator);

        await renderWithProviders(
            <Routes>
                <Route
                    path="/admin/moderation"
                    element={
                        <RequireRole roles={[UserRole.Admin, UserRole.Moderator]}>
                            <div>moderation center</div>
                        </RequireRole>
                    }
                />
            </Routes>,
            { route: '/admin/moderation' },
        );

        expect(await screen.findByText('moderation center')).toBeInTheDocument();
    });

    it('treats a persisted session WITHOUT a token as anonymous', async () => {
        // Simulate tampering: `isAuthenticated` flipped in localStorage, but
        // no session token present. The integrity check runs during store
        // rehydration (onRehydrateStorage), so reload the store module with
        // the poisoned storage in place.
        localStorage.setItem(
            'cine-network-user',
            JSON.stringify({
                state: { user: profile(UserRole.Admin), isAuthenticated: true },
                version: 0,
            }),
        );
        clearAuthToken();

        vi.resetModules();
        const { useUserStore: freshStore } = await import('../../store/userStore');

        expect(freshStore.getState().isAuthenticated).toBe(false);
        expect(freshStore.getState().user).toBeNull();
    });
});
