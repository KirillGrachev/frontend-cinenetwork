import React from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router';
import { AppRoute } from '../../types';
import { useLocale } from '../../context/LocaleContext';
import SearchResultsPopup from './SearchResultsPopup';
import NavbarSearchForm from './NavbarSearchForm';
import { useNavbarDesktopLogic } from '../../hooks/useNavbarDesktopLogic';
import { useSearchStore } from '../../store/searchStore';

interface NavbarDesktopNavProps {
    onOpenPost: (id: number) => void;
    searchInputRef: React.RefObject<HTMLInputElement | null>;
}

const NavbarDesktopNav: React.FC<NavbarDesktopNavProps> = ({ onOpenPost, searchInputRef }) => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const location = useLocation();

    const isSearchOpen = useSearchStore((s) => s.isSearchOpen);
    const searchQuery = useSearchStore((s) => s.searchQuery);
    const searchCategory = useSearchStore((s) => s.searchCategory);

    const { state, actions } = useNavbarDesktopLogic(isSearchOpen, searchQuery, searchInputRef);
    const { isResultsVisible, searchFilters } = state;

    const handleSearchSubmit = (e: React.FormEvent) => {
        actions.handleSearchSubmit(e);
        if (searchQuery.trim()) {
            navigate(
                `${AppRoute.Search}?q=${encodeURIComponent(searchQuery)}&cat=${searchCategory}`,
            );
        }
    };

    /** Check if a route is active. For Home ('/'), require exact match. */
    const isActive = (path: string) => {
        if (path === AppRoute.Home) {
            return location.pathname === AppRoute.Home;
        }
        return !!matchPath({ path: `${path}/*` }, location.pathname);
    };

    const navLinkClass = (path: string) =>
        `h-full px-4 rounded-full text-sm font-semibold transition-colors duration-200 shadow-sm cursor-pointer whitespace-nowrap flex items-center justify-center ${isActive(path) ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'}`;

    const navLinksMap: { path: string; label: string }[] = [
        { path: AppRoute.Home, label: t('navbar.home') },
        { path: AppRoute.Catalog, label: t('navbar.catalog') },
        { path: AppRoute.Collections, label: t('navbar.collections') },
        { path: AppRoute.Schedule, label: t('navbar.schedule') },
        { path: AppRoute.News, label: t('navbar.news') },
    ];

    const renderNavLinks = () => (
        <div className="flex items-center justify-center gap-1 w-full h-full">
            {navLinksMap.map((link) => (
                <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={navLinkClass(link.path)}
                >
                    {link.label}
                </button>
            ))}
        </div>
    );

    return (
        <div
            className={`hidden md:flex relative bg-panel-primary/90 backdrop-blur-xl border border-border-medium rounded-full p-1 items-center h-[46px] transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSearchOpen ? 'w-[576px] max-w-xl' : 'w-fit'}`}
        >
            <div
                className={`w-full h-full flex items-center justify-center transition-all duration-200 ease-out origin-center ${isSearchOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
            >
                {renderNavLinks()}
            </div>

            {/** Search Form Container - Maximized Area */}
            <div
                className={`absolute inset-0.5 h-[calc(100%-4px)] transition-all duration-300 ease-out origin-center ${isSearchOpen ? 'opacity-100 scale-100 delay-75' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
                <NavbarSearchForm
                    searchInputRef={searchInputRef}
                    onFiltersChange={actions.setFilters}
                    onSubmit={handleSearchSubmit}
                    setIsFilterMenuOpen={actions.setIsFilterMenuOpen}
                />
            </div>

            {isResultsVisible && (
                <SearchResultsPopup
                    query={searchQuery}
                    category={searchCategory}
                    filters={searchFilters}
                    onOpenPost={onOpenPost}
                    onClose={actions.closeResults}
                />
            )}
        </div>
    );
};

export default NavbarDesktopNav;
