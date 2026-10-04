import React from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router';
import { AppRoute, ToastType } from '../types';
import { useLocale } from '../context/LocaleContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const MobileBottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLocale();
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();

    const navItems = [
        { label: t('navbar.home'), path: AppRoute.Home, icon: 'fa-house' },
        { label: t('navbar.catalog'), path: AppRoute.Catalog, icon: 'fa-layer-group' },
        { label: t('navbar.search'), path: AppRoute.Search, icon: 'fa-magnifying-glass' },
        { label: t('favorites.title'), path: AppRoute.Favorites, icon: 'fa-bookmark' },
        {
            label: isAuthenticated ? t('navbar.userMenu.profile') : t('navbar.login'),
            path: AppRoute.Profile,
            icon: 'fa-user',
        },
    ];

    const isActive = (path: string) => {
        if (path === AppRoute.Home) {
            return location.pathname === AppRoute.Home;
        }
        // Handle dynamic routes or sub-routes
        return (
            !!matchPath({ path: `${path}/*` }, location.pathname) ||
            location.pathname.startsWith(path)
        );
    };

    const handleNavigation = (path: string) => {
        // Logic 1: Search is disabled on mobile for now
        if (path === AppRoute.Search) {
            showToast(t('settings.inDevelopment.title'), ToastType.Info);
            return;
        }

        // Logic 2: Profile tab acts as Login entry point if not authenticated
        if (path === AppRoute.Profile && !isAuthenticated) {
            navigate(AppRoute.Login);
            return;
        }

        navigate(path);
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background-secondary/90 backdrop-blur-xl border-t border-white/5 pb-safe">
            <div className="flex justify-around items-center h-[60px]">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <button
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-300 ${
                                active ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <div
                                className={`relative px-3 py-1 rounded-full transition-all duration-300 ${active ? 'bg-white/10' : ''}`}
                            >
                                <i
                                    className={`fa-solid ${item.icon} text-lg ${active ? 'scale-110' : 'scale-100'} transition-transform`}
                                ></i>
                            </div>
                            <span className="text-[10px] font-medium leading-none">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
