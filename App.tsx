import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation, Outlet, Navigate } from 'react-router';
import * as Pages from './routes';
import { useAuth } from './context/AuthContext';
import { useNotificationStore } from './store/notificationStore';
import { useUserStore } from './store/userStore';
import PageTransition from './components/ui/PageTransition';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { AppRoute, UserRole } from './types';
import type { AuthCredentials } from './types';
import { RequireAuth, RequireRole } from './components/routing/RouteGuards';

/** Lazy load the CuratorModal so it's not bundled with the main entry point */
const CuratorModal = React.lazy(() => import('./components/collections/CuratorModal'));

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCuratorModalOpen, setIsCuratorModalOpen] = useState(false);

    // --- Global Sync Logic (Stale-While-Revalidate) ---
    const { syncWithBackend: syncNotifications } = useNotificationStore();
    const { syncUser } = useUserStore();

    useEffect(() => {
        // Trigger background syncs on app mount.
        // Non-blocking: the UI renders immediately with persisted local data.
        // (The former animeStore.syncWithServer() was a no-op stub and is gone.)
        void syncNotifications();
        void syncUser();
    }, [syncNotifications, syncUser]);
    // --------------------------------------------------

    const openBlogPost = (id: number) => navigate(`${AppRoute.News}/${id}`);

    return (
        <div className="flex flex-col min-h-screen">
            <ScrollToTop />
            <Navbar onOpenPost={openBlogPost} />
            <main className="flex-1 flex flex-col">
                <Suspense
                    fallback={
                        <div className="w-full min-h-screen flex items-center justify-center">
                            <LoadingSpinner size="lg" />
                        </div>
                    }
                >
                    <PageTransition key={location.key}>
                        <Outlet context={{ openCuratorModal: () => setIsCuratorModalOpen(true) }} />
                    </PageTransition>
                </Suspense>
            </main>
            <Footer />
            <MobileBottomNav />

            {/** Suspense wrapper for the modal chunk */}
            <Suspense fallback={null}>
                {isCuratorModalOpen && (
                    <CuratorModal
                        isOpen={isCuratorModalOpen}
                        onClose={() => setIsCuratorModalOpen(false)}
                    />
                )}
            </Suspense>
        </div>
    );
};

/**
 * Persists the last visited route in sessionStorage and restores it once on
 * a fresh load at '/'. Uses a ref (not state): the restore must not trigger
 * a re-render cascade, and it only ever happens on the first effect run.
 */
function RouteSyncer() {
    const location = useLocation();
    const navigate = useNavigate();
    const hasRestoredRef = useRef(false);

    useEffect(() => {
        const currentPath = location.pathname + location.search;

        if (!hasRestoredRef.current) {
            hasRestoredRef.current = true;
            const savedPath = sessionStorage.getItem('last_route');
            if (savedPath && savedPath !== currentPath && location.pathname === '/') {
                navigate(savedPath, { replace: true });
                return; // don't overwrite the saved route with '/'
            }
        }

        if (location.pathname) {
            sessionStorage.setItem('last_route', currentPath);
        }
    }, [location, navigate]);

    return null;
}

function App() {
    const { isAuthenticated, login } = useAuth();

    /** Login navigation (including redirect back to the guarded page) is
     *  owned by the Login page itself — it knows `location.state.from`. */
    const handleLoginSuccess = async (credentials?: AuthCredentials) => {
        await login(credentials);
    };

    /** Helper to strip leading slash for sub-routes */
    const p = (route: string) => route.substring(1);

    return (
        <div className="bg-background-primary text-white font-sans selection:bg-white/30">
            <RouteSyncer />
            <ErrorBoundary>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route index element={<Pages.Home />} />
                        <Route path={p(AppRoute.Catalog)} element={<Pages.Catalog />} />
                        <Route path="anime/:id" element={<Pages.AnimePage />} />
                        <Route path="watch/:id" element={<Pages.WatchPage />} />
                        <Route path="character/:id" element={<Pages.CharacterPage />} />
                        <Route path="studio/:name" element={<Pages.StudioPage />} />
                        <Route path={p(AppRoute.Collections)} element={<Pages.Collections />} />
                        <Route
                            path={`${p(AppRoute.Collections)}/:id`}
                            element={<Pages.CollectionDetail />}
                        />
                        <Route
                            path={`${p(AppRoute.Collections)}/:id/curators`}
                            element={<Pages.CollectionCurators />}
                        />
                        <Route path={p(AppRoute.Schedule)} element={<Pages.Schedule />} />
                        <Route path={p(AppRoute.News)} element={<Pages.News />} />
                        <Route path={`${p(AppRoute.News)}/:id`} element={<Pages.BlogPost />} />
                        <Route path={p(AppRoute.Search)} element={<Pages.SearchView />} />
                        <Route path={p(AppRoute.Status)} element={<Pages.StatusPage />} />
                        <Route path={p(AppRoute.Support)} element={<Pages.Support />} />
                        <Route
                            path={p(AppRoute.Docs)}
                            element={<Navigate to={`${AppRoute.Docs}/agreement`} replace />}
                        />
                        <Route path={`${p(AppRoute.Docs)}/:id`} element={<Pages.Documentation />} />
                        <Route
                            path={p(AppRoute.Settings)}
                            element={
                                <RequireAuth>
                                    <Pages.Settings />
                                </RequireAuth>
                            }
                        />
                        <Route path={p(AppRoute.TopCharts)} element={<Pages.TopCharts />} />
                        <Route
                            path={p(AppRoute.Notifications)}
                            element={
                                <RequireAuth>
                                    <Pages.Notifications />
                                </RequireAuth>
                            }
                        />

                        {/* Unified Profile Route: /profile (own) and /profile/:id (specific user) */}
                        <Route path={p(AppRoute.Profile)} element={<Pages.Profile />} />
                        <Route path="profile/:id" element={<Pages.Profile />} />

                        {/** Open Favorites for testing without auth */}
                        <Route path={p(AppRoute.Favorites)} element={<Pages.Favorites />} />
                        <Route path={p(AppRoute.History)} element={<Pages.History />} />

                        {/** Admin Routes — staff only */}
                        <Route
                            path={p(AppRoute.AdminStats)}
                            element={
                                <RequireRole roles={[UserRole.Admin, UserRole.Moderator]}>
                                    <Pages.AdminStats />
                                </RequireRole>
                            }
                        />
                        <Route
                            path={p(AppRoute.AdminModeration)}
                            element={
                                <RequireRole roles={[UserRole.Admin, UserRole.Moderator]}>
                                    <Pages.AdminModeration />
                                </RequireRole>
                            }
                        />
                        <Route
                            path={p(AppRoute.AdminActivity)}
                            element={
                                <RequireRole roles={[UserRole.Admin, UserRole.Moderator]}>
                                    <Pages.AdminActivityLog />
                                </RequireRole>
                            }
                        />
                        <Route
                            path={p(AppRoute.AdminUsers)}
                            element={
                                <RequireRole roles={[UserRole.Admin, UserRole.Moderator]}>
                                    <Pages.AdminUsers />
                                </RequireRole>
                            }
                        />

                        {/** Redirect authenticated users away from auth pages */}
                        <Route
                            path={p(AppRoute.Login)}
                            element={
                                isAuthenticated ? (
                                    <Navigate to={AppRoute.Profile} replace />
                                ) : (
                                    <Pages.Login onLoginSuccess={handleLoginSuccess} />
                                )
                            }
                        />
                        <Route
                            path={p(AppRoute.Register)}
                            element={
                                isAuthenticated ? (
                                    <Navigate to={AppRoute.Profile} replace />
                                ) : (
                                    <Pages.Registration />
                                )
                            }
                        />
                        <Route
                            path={p(AppRoute.ForgotPassword)}
                            element={
                                isAuthenticated ? (
                                    <Navigate to={AppRoute.Profile} replace />
                                ) : (
                                    <Pages.ForgotPassword />
                                )
                            }
                        />
                        <Route
                            path={p(AppRoute.VerifyEmail)}
                            element={
                                isAuthenticated ? (
                                    <Navigate to={AppRoute.Profile} replace />
                                ) : (
                                    <Pages.VerifyEmail />
                                )
                            }
                        />

                        {/** 404 Route */}
                        <Route path="*" element={<Pages.NotFound />} />
                    </Route>
                </Routes>
            </ErrorBoundary>
        </div>
    );
}

export default App;
