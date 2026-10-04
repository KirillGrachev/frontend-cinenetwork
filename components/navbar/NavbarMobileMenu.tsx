import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Button from '../ui/Button';
import { useNavbarMobileLogic } from '../../hooks/useNavbarMobileLogic';
import { useNavigate, useLocation, matchPath } from 'react-router';
import { AppRoute } from '../../types';

interface NavbarMobileMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isAuthPage: boolean;
}

const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({ isOpen, setIsOpen, isAuthPage }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state, actions } = useNavbarMobileLogic(setIsOpen, (path: string) => navigate(path));
    const { t, localQuery, navItems } = state;

    /** Check if a route is active. */
    const isActive = (path: string) => {
        if (path === AppRoute.Home) {
            return location.pathname === AppRoute.Home;
        }
        return !!matchPath({ path: `${path}/*` }, location.pathname);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[60] md:hidden" onClose={actions.closeMenu}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-full max-w-xs">
                                    <div className="flex h-full flex-col bg-background-secondary border-r border-border-medium shadow-2xl p-6 overflow-y-auto">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-8">
                                            <Dialog.Title className="text-xl font-bold text-white tracking-tight">
                                                {t('navbar.menu')}
                                            </Dialog.Title>
                                            <button
                                                onClick={actions.closeMenu}
                                                aria-label={t('navbar.closeMenu')}
                                                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors focus:outline-none"
                                            >
                                                <i className="fa-solid fa-xmark text-lg"></i>
                                            </button>
                                        </div>

                                        {/* Search */}
                                        <div className="mb-8 relative">
                                            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                            <input
                                                type="text"
                                                placeholder={t('navbar.search')}
                                                value={localQuery}
                                                onChange={(e) =>
                                                    actions.setLocalQuery(e.target.value)
                                                }
                                                onKeyDown={actions.handleMobileSearch}
                                                className="w-full bg-panel-secondary border border-border-medium rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none placeholder-gray-600 transition-all"
                                            />
                                        </div>

                                        {/* Nav Items */}
                                        <div className="flex flex-col gap-2 flex-1">
                                            {navItems.map((item, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() =>
                                                        actions.handleNavClick(item.path)
                                                    }
                                                    className={`flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 focus:outline-none ${
                                                        isActive(item.path)
                                                            ? 'bg-white text-black font-bold'
                                                            : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'
                                                    }`}
                                                >
                                                    <i
                                                        className={`fa-solid ${item.icon} w-5 text-center`}
                                                    ></i>
                                                    <span className="text-base">{item.label}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Footer Actions */}
                                        <div className="mt-8">
                                            {isAuthPage ? (
                                                <Button
                                                    variant="black"
                                                    size="lg"
                                                    className="w-full justify-center"
                                                    onClick={() =>
                                                        actions.handleNavClick(AppRoute.Home)
                                                    }
                                                >
                                                    {t('navbar.backToHome')}
                                                </Button>
                                            ) : (
                                                <div className="flex flex-col gap-3">
                                                    <Button
                                                        variant="primary"
                                                        size="lg"
                                                        className="w-full justify-center"
                                                        onClick={() =>
                                                            actions.handleNavClick(AppRoute.Login)
                                                        }
                                                    >
                                                        {t('auth.login')}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="lg"
                                                        className="w-full justify-center"
                                                        onClick={() =>
                                                            actions.handleNavClick(
                                                                AppRoute.Register,
                                                            )
                                                        }
                                                    >
                                                        {t('auth.register')}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default NavbarMobileMenu;
