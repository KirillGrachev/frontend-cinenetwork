
import React, { Fragment } from 'react';
import { useNavigate } from 'react-router';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import { AppRoute } from '../../types';

const UserProfile: React.FC = () => {
    const { user, logout } = useAuth();
    const { t } = useLocale();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate(AppRoute.Home);
    };

    if (!user) return null;
    
    const menuItems = [
        { label: t('navbar.userMenu.profile'), path: AppRoute.Profile, icon: 'fa-solid fa-user text-purple-400' },
        { label: t('navbar.userMenu.favorites'), path: AppRoute.Favorites, icon: 'fa-solid fa-bookmark' },
        { label: t('navbar.userMenu.history'), path: AppRoute.History, icon: 'fa-solid fa-clock-rotate-left' },
        { label: t('navbar.userMenu.settings'), path: AppRoute.Settings, icon: 'fa-solid fa-sliders' },
    ];

    if (user.id === 1) {
        menuItems.unshift({ label: t('navbar.userMenu.admin'), path: AppRoute.AdminStats, icon: 'fa-solid fa-chart-line text-blue-400' });
    }

    return (
        <Menu as="div" className="relative">
            <Menu.Button 
                aria-label={t('navbar.userMenu.toggle')}
                className="w-10 h-10 rounded-full bg-item-primary border border-border-medium flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-105 active:opacity-80 focus:outline-none"
            >
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={t('navbar.userMenu.avatarAlt')} className="w-full h-full object-cover" />
                ) : (
                    <span className="font-bold text-lg text-gray-400">{user.username.charAt(0).toUpperCase()}</span>
                )}
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
                    <div className="p-4 border-b border-border-light">
                        <p className="font-bold text-white text-sm truncate">{user.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                        {menuItems.map(item => (
                            <Menu.Item key={item.path}>
                                {({ active }) => (
                                    <button 
                                        onClick={() => navigate(item.path)} 
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                                            active ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'
                                        }`}
                                    >
                                        <i className={`${item.icon} w-5 text-center ${item.path.includes('admin') || item.path.includes('profile') ? '' : 'text-gray-500'}`}></i>
                                        <span>{item.label}</span>
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                    <div className="p-2 border-t border-border-light">
                         <Menu.Item>
                            {({ active }) => (
                                <button 
                                    onClick={handleLogout} 
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 transition-colors ${
                                        active ? 'bg-red-500/10' : 'hover:bg-red-500/10'
                                    }`}
                                >
                                    <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center text-red-500/80"></i>
                                    <span>{t('navbar.userMenu.logout')}</span>
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default UserProfile;
