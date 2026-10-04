import React, { Fragment } from 'react';
import { formatRelativeTime } from '../../utils/datetime';
import { useLocale } from '../../context/LocaleContext';
import { useNavigate } from 'react-router';
import { AppRoute, ToastType } from '../../types';
import { Virtuoso } from 'react-virtuoso';
import { Popover, Transition } from '@headlessui/react';
import { useToast } from '../../context/ToastContext';
import { useNotificationStore, selectUnreadCount } from '../../store/notificationStore';

const NotificationDropdown: React.FC = () => {
    const { t, locale } = useLocale();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Selector-based store access (no full-store subscription).
    const notifications = useNotificationStore((s) => s.notifications);
    const markAsRead = useNotificationStore((s) => s.markAsRead);
    const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
    const isLoading = useNotificationStore((s) => s.isLoading);
    const unreadCount = useNotificationStore(selectUnreadCount);

    const handleMarkAllRead = () => {
        markAllAsRead();
        showToast(t('layout.navbar.notifications.markAllRead'), ToastType.Success);
    };

    const handleItemClick = (link: string | undefined, id: number, close: () => void) => {
        markAsRead(id);
        if (link) {
            navigate(link);
        }
        close();
    };

    const handleViewAll = (close: () => void) => {
        navigate(AppRoute.Notifications);
        close();
    };

    /** Shared helper — was duplicated verbatim in Notifications.tsx. */
    const getTimeLabel = (isoTime: string) => formatRelativeTime(isoTime, locale);

    // Calculate dynamic height: ~85px per item, max 400px
    const listHeight = Math.min(notifications.length * 85, 400);

    return (
        <Popover className="relative">
            {({ open, close }) => (
                <>
                    <Popover.Button
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative outline-none focus:outline-none ${open ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                        aria-label={t('layout.navbar.notifications.title')}
                    >
                        <i
                            className={`fa-regular fa-bell text-lg ${isLoading ? 'animate-pulse' : ''}`}
                        ></i>
                        {unreadCount > 0 && (
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border border-panel-primary"></span>
                        )}
                    </Popover.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute top-full right-0 mt-3 w-80 md:w-96 bg-panel-primary/95 backdrop-blur-2xl  rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-50 overflow-hidden origin-top-right">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-panel-primary">
                                <h3 className="font-bold text-white text-sm">
                                    {t('layout.navbar.notifications.title')}
                                </h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wide"
                                    >
                                        {t('layout.navbar.notifications.markAllRead')}
                                    </button>
                                )}
                            </div>

                            {notifications.length > 0 ? (
                                <div style={{ height: `${listHeight}px` }}>
                                    <Virtuoso
                                        style={{ height: '100%' }}
                                        totalCount={notifications.length}
                                        className="custom-scrollbar"
                                        itemContent={(index) => {
                                            const note = notifications[index];
                                            return (
                                                <button
                                                    key={note.id}
                                                    onClick={() =>
                                                        handleItemClick(note.link, note.id, close)
                                                    }
                                                    className={`w-full flex items-start gap-3 p-4 text-left border-b border-white/5 hover:bg-white/5 transition-colors focus:outline-none focus:bg-white/5 ${!note.isRead ? 'bg-blue-500/5' : ''}`}
                                                >
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border border-white/10 ${
                                                            note.type === 'system'
                                                                ? 'bg-purple-500/20 text-purple-400'
                                                                : note.type === 'release'
                                                                  ? 'bg-green-500/20 text-green-400'
                                                                  : note.type === 'like'
                                                                    ? 'bg-red-500/20 text-red-400'
                                                                    : 'bg-item-primary text-gray-400'
                                                        }`}
                                                    >
                                                        {note.image ? (
                                                            <img
                                                                src={note.image}
                                                                alt=""
                                                                className="w-full h-full object-cover rounded-full"
                                                            />
                                                        ) : (
                                                            <i
                                                                className={`fa-solid ${
                                                                    note.type === 'system'
                                                                        ? 'fa-gear'
                                                                        : note.type === 'release'
                                                                          ? 'fa-play'
                                                                          : note.type === 'like'
                                                                            ? 'fa-heart'
                                                                            : 'fa-comment'
                                                                } text-sm`}
                                                            ></i>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-baseline mb-0.5">
                                                            <span
                                                                className={`text-sm font-bold truncate pr-2 ${!note.isRead ? 'text-white' : 'text-gray-300'}`}
                                                            >
                                                                {note.title}
                                                            </span>
                                                            {!note.isRead && (
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-400 leading-snug line-clamp-2 mb-1.5">
                                                            {note.description}
                                                        </p>
                                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                                                            {getTimeLabel(note.time)}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 text-gray-600">
                                        <i className="fa-regular fa-bell-slash text-xl"></i>
                                    </div>
                                    <p className="text-gray-500 text-xs font-medium">
                                        {t('layout.navbar.notifications.empty')}
                                    </p>
                                </div>
                            )}

                            <div className="p-2 border-t border-white/5 bg-black/20 relative z-10">
                                <button
                                    onClick={() => handleViewAll(close)}
                                    className="w-full py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                                >
                                    {t('layout.navbar.notifications.viewAll')}
                                </button>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default NotificationDropdown;
