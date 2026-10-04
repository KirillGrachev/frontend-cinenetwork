import type React from 'react';
import { useState } from 'react';
import { SearchCategory, AppView, AppRoute } from '../types';
import { useLocale } from '../context/LocaleContext';
import { useSearchStore } from '../store/searchStore';

export const useNavbarMobileLogic = (
    setIsOpen: (isOpen: boolean) => void,
    onNavigate: (path: string) => void,
) => {
    const { t } = useLocale();
    const [localQuery, setLocalQuery] = useState('');
    const { setSearchQuery, setSearchCategory } = useSearchStore();

    const actions = {
        handleNavClick: (path: string) => {
            onNavigate(path);
            setIsOpen(false);
        },
        handleMobileSearch: (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && localQuery.trim()) {
                const category: SearchCategory =
                    SearchCategory.Anime; /** Default to 'anime' search on mobile */
                setSearchQuery(localQuery);
                setSearchCategory(category);
                onNavigate(
                    `${AppRoute.Search}?q=${encodeURIComponent(localQuery)}&cat=${category}`,
                );
                setLocalQuery('');
                setIsOpen(false);
            }
        },
        setLocalQuery,
        closeMenu: () => setIsOpen(false),
    };

    const navItems = [
        { label: t('navbar.home'), view: AppView.Home, path: AppRoute.Home, icon: 'fa-house' },
        {
            label: t('navbar.catalog'),
            view: AppView.Catalog,
            path: AppRoute.Catalog,
            icon: 'fa-layer-group',
        },
        /** Removed favorites from mobile menu as requested */
        {
            label: t('navbar.collections'),
            view: AppView.Collections,
            path: AppRoute.Collections,
            icon: 'fa-bookmark',
        },
        {
            label: t('navbar.schedule'),
            view: AppView.Schedule,
            path: AppRoute.Schedule,
            icon: 'fa-calendar',
        },
        { label: t('navbar.news'), view: AppView.News, path: AppRoute.News, icon: 'fa-newspaper' },
    ];

    return {
        state: {
            t,
            localQuery,
            navItems,
        },
        actions,
    };
};
