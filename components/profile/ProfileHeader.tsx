import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import type { UserProfileData } from '../../types';
import Button from '../ui/Button';
import AnimeImage from '../AnimeImage';
import { useLocale } from '../../context/LocaleContext';

interface ProfileHeaderProps {
    profile: UserProfileData;
    isOwnProfile: boolean;
    isFollowing: boolean;
    isMenuOpen: boolean; // Kept for interface compat, but unused with Headless UI
    setIsMenuOpen: (isOpen: boolean) => void; // Kept for interface compat
    onEdit: () => void;
    onFollow: () => void;
    onCopyLink: () => void;
    onReport: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    profile,
    isOwnProfile,
    isFollowing,
    onEdit,
    onFollow,
    onCopyLink,
    onReport,
}) => {
    const { t } = useLocale();

    return (
        <div className="relative">
            {/* Cover */}
            <div className="h-64 md:h-80 w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-background-primary">
                    {profile.coverUrl ? (
                        <AnimeImage
                            src={profile.coverUrl}
                            alt="Cover"
                            className="w-full h-full object-cover opacity-60"
                        />
                    ) : (
                        <div className="w-full h-full bg-panel-primary opacity-50"></div>
                    )}
                    {/* Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/60 to-transparent"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10 -mt-20">
                <div className="flex flex-col md:flex-row items-end gap-6 md:gap-8">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background-primary bg-panel-primary shadow-2xl flex items-center justify-center overflow-hidden relative z-10 group">
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-6xl md:text-7xl font-bold text-gray-500">
                                    {profile.username.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Identity & Actions */}
                    <div className="flex-1 w-full pb-2">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                                    {profile.username}
                                </h1>
                                <p className="text-gray-400 text-sm max-w-lg leading-relaxed line-clamp-2 md:line-clamp-1 mb-2">
                                    {profile.bio ||
                                        t('info.profile.joined', { date: profile.joinDate })}
                                </p>
                            </div>

                            <div className="flex gap-3 items-center">
                                {isOwnProfile ? (
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        icon="fa-solid fa-pen"
                                        className="rounded-xl border-border-medium px-6"
                                        onClick={onEdit}
                                    >
                                        {t('info.profile.edit')}
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            size="sm"
                                            variant={isFollowing ? 'secondary' : 'primary'}
                                            icon={
                                                isFollowing
                                                    ? 'fa-solid fa-check'
                                                    : 'fa-solid fa-user-plus'
                                            }
                                            className="rounded-xl px-6"
                                            onClick={onFollow}
                                        >
                                            {isFollowing
                                                ? t('info.profile.actions.following')
                                                : t('info.profile.actions.follow')}
                                        </Button>

                                        {/* Dropdown Menu (Headless UI) */}
                                        <Menu as="div" className="relative">
                                            <Menu.Button
                                                className="w-10 h-10 rounded-xl bg-panel-primary border border-border-medium flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                                                aria-label="More actions"
                                            >
                                                <i className="fa-solid fa-ellipsis"></i>
                                            </Menu.Button>

                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 top-full mt-2 w-48 bg-panel-primary border border-border-medium rounded-xl shadow-xl z-50 overflow-hidden outline-none origin-top-right">
                                                    <div className="p-1">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button
                                                                    onClick={onCopyLink}
                                                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors ${active ? 'bg-white/10 text-white' : 'text-gray-300'}`}
                                                                >
                                                                    <i className="fa-solid fa-link w-4 text-gray-500"></i>{' '}
                                                                    {t(
                                                                        'info.profile.actions.copyLink',
                                                                    )}
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button
                                                                    onClick={onReport}
                                                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors ${active ? 'bg-red-500/10 text-red-300' : 'text-red-400'}`}
                                                                >
                                                                    <i className="fa-solid fa-flag w-4"></i>{' '}
                                                                    {t(
                                                                        'info.profile.actions.report',
                                                                    )}
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    </div>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
