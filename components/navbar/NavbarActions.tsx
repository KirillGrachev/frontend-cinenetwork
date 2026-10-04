import React, { Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Menu, Transition } from '@headlessui/react';
import Button from '../ui/Button';
import { useLocale } from '../../context/LocaleContext';
import { useAuth } from '../../context/AuthContext';
import UserProfile from './UserProfile';
import { useSearchStore } from '../../store/searchStore';
import { AppRoute } from '../../types';
import NotificationDropdown from './NotificationDropdown';

interface NavbarActionsProps {
    isAuthPage: boolean;
}

const NavbarActions: React.FC<NavbarActionsProps> = ({ isAuthPage }) => {
    const { t, locale, setLocale, availableLocales } = useLocale();
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { isSearchOpen, toggleSearchOpen, setSearchQuery } = useSearchStore();

    const handleToggleSearch = () => {
        if (isSearchOpen) {
            setSearchQuery('');
        }
        toggleSearchOpen();
    };

    const handleCycleLanguage = () => {
        const currentIndex = availableLocales.indexOf(locale);
        const nextIndex = (currentIndex + 1) % availableLocales.length;
        setLocale(availableLocales[nextIndex]);
    };

    const handleLogout = () => {
        logout();
        navigate(AppRoute.Home);
    };

    const isProfilePage = location.pathname.includes('/profile');
    const showAuthNav = isAuthenticated || isProfilePage;

    return (
        <div className="flex items-center gap-6">
            {/* 1. Search Toggle - Hidden on mobile, as search is in bottom nav */}
            <button
                onClick={handleToggleSearch}
                aria-label={isSearchOpen ? t('navbar.closeSearch') : t('navbar.openSearch')}
                className={`hidden lg:flex w-10 h-10 rounded-xl items-center justify-center transition-all duration-300  ${isSearchOpen ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
                <i
                    className={`fa-solid ${isSearchOpen ? 'fa-xmark' : 'fa-magnifying-glass'} text-lg`}
                ></i>
            </button>

            <div className="flex items-center justify-end">
                {isAuthPage ? (
                    <Button
                        variant="soft"
                        size="md"
                        className="font-bold px-8 w-44 ml-2 hidden lg:flex"
                        onClick={() => navigate(AppRoute.Home)}
                        icon="fa-solid fa-arrow-left"
                    >
                        {t('navbar.backToHome')}
                    </Button>
                ) : showAuthNav ? (
                    <div className="flex items-center gap-4">
                        {/* Icons Group */}
                        <div className="flex items-center gap-1">
                            {/* 2. Notifications (Popover) */}
                            <NotificationDropdown />

                            {/* 3. Settings Dropdown (Menu) - Hidden on Mobile */}
                            <Menu as="div" className="relative hidden md:block">
                                {({ open }) => (
                                    <>
                                        <Menu.Button
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300  ${
                                                open
                                                    ? 'text-white bg-white/10'
                                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                                            }`}
                                            aria-label="Settings"
                                        >
                                            <i className="fa-solid fa-gear text-lg"></i>
                                        </Menu.Button>

                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-100"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute top-full right-0 mt-3 w-64 bg-panel-primary/95 backdrop-blur-2xl border border-border-medium rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-50 overflow-hidden outline-none origin-top-right">
                                                {/* Language Switcher */}
                                                <div className="p-4 border-b border-white/5">
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">
                                                        {t(
                                                            'settings.preferences.interfaceLanguage',
                                                        )}
                                                    </span>
                                                    <button
                                                        onClick={handleCycleLanguage}
                                                        className="w-full flex items-center justify-between px-4 py-2.5 bg-black/20 hover:bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-all group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <i className="fa-solid fa-globe text-gray-400 group-hover:text-white transition-colors"></i>
                                                            <span className="text-sm font-bold text-gray-200 group-hover:text-white">
                                                                {t(`languages.${locale}`)}
                                                            </span>
                                                        </div>
                                                        <i className="fa-solid fa-rotate text-xs text-gray-500 group-hover:text-white transition-colors"></i>
                                                    </button>
                                                </div>

                                                {/* Quick Links */}
                                                <div className="p-2">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={() =>
                                                                    navigate(AppRoute.Settings)
                                                                }
                                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${active ? 'bg-white/10 text-white' : 'text-gray-300'}`}
                                                            >
                                                                <i className="fa-solid fa-sliders w-5 text-center text-gray-500"></i>
                                                                <span>
                                                                    {t('navbar.userMenu.settings')}
                                                                </span>
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={() =>
                                                                    navigate(AppRoute.Support)
                                                                }
                                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${active ? 'bg-white/10 text-white' : 'text-gray-300'}`}
                                                            >
                                                                <i className="fa-solid fa-life-ring w-5 text-center text-gray-500"></i>
                                                                <span>
                                                                    {t('footer.userLinks.support')}
                                                                </span>
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </div>

                                                {/* Logout */}
                                                <div className="p-2 border-t border-white/5 mt-1 bg-black/20">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={handleLogout}
                                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 transition-colors font-medium ${active ? 'bg-red-500/10 text-red-300' : 'hover:bg-red-500/10 hover:text-red-300'}`}
                                                            >
                                                                <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center"></i>
                                                                <span>
                                                                    {t('navbar.userMenu.logout')}
                                                                </span>
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </>
                                )}
                            </Menu>
                        </div>

                        {/* 4. User Profile */}
                        <div className="hidden lg:block">
                            <UserProfile />
                        </div>
                    </div>
                ) : (
                    <div className="w-44 flex justify-end hidden lg:flex">
                        <Button
                            variant="primary"
                            className="px-8 border border-transparent text-sm font-bold tracking-wide transition-all duration-300"
                            onClick={() => navigate(AppRoute.Login)}
                        >
                            {t('navbar.login')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavbarActions;
