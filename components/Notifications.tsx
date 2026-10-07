import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Virtuoso } from 'react-virtuoso';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';
import EmptyState from './ui/EmptyState';
import HistoryClearModal from './history/HistoryClearModal';
import { useLocale } from '../context/LocaleContext';
import { AppRoute, HistoryClearPeriod, ToastType } from '../types';
import { useToast } from '../context/ToastContext';
import { useNotificationStore } from '../store/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

const Notifications: React.FC = () => {
    const { t, locale } = useLocale();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Use Store
    const { notifications, markAllAsRead, markAsRead, clearNotifications } = useNotificationStore();

    // Modal State
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);

    const handleMarkAllRead = () => {
        markAllAsRead();
        showToast(t('layout.navbar.notifications.markAllRead'), ToastType.Success);
    };

    const handleClearByPeriod = (period: HistoryClearPeriod) => {
        // Simplified Logic: The store currently only has clearAll. 
        // In a real app, we would filter inside the store.
        if (period === HistoryClearPeriod.AllTime) {
            clearNotifications();
            setIsClearModalOpen(false);
            showToast(t('history.clearHistory'), ToastType.Success);
        } else {
            // Placeholder for partial clear
            showToast("Частичная очистка в разработке", ToastType.Info);
            setIsClearModalOpen(false);
        }
    };

    const handleItemClick = (link: string | undefined, id: number) => {
        markAsRead(id);
        if (link) navigate(link);
    };

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate(AppRoute.Home);
        }
    };

    // Helper for relative time
    const getTimeLabel = (isoTime: string) => {
        try {
            return formatDistanceToNow(new Date(isoTime), { 
                addSuffix: true, 
                locale: locale === 'ru' ? ru : enUS 
            });
        } catch (e) {
            return isoTime;
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-8 flex flex-col h-full">
                
                <div className="mb-8">
                    <Button 
                        variant="ghost" 
                        size="md" 
                        icon="fa-solid fa-arrow-left" 
                        onClick={handleBack}
                        className="pl-0 hover:!bg-transparent hover:text-white text-gray-400 transition-colors"
                    >
                        {t('common.ui.back')}
                    </Button>
                </div>

                <PageHeader
                    title={t('layout.navbar.notifications.title')}
                    description="Будьте в курсе последних событий и обновлений."
                    actions={
                        notifications.length > 0 && (
                            <div className="flex gap-3">
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={handleMarkAllRead}
                                    className="rounded-xl "
                                >
                                    {t('layout.navbar.notifications.markAllRead')}
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setIsClearModalOpen(true)}
                                    className="rounded-xl text-gray-400 hover:!bg-transparent hover:text-red-400 transition-colors"
                                >
                                    Очистить уведомления
                                </Button>
                            </div>
                        )
                    }
                    className="!mb-8"
                />

                <div className="flex-1 min-h-[600px]">
                    {notifications.length > 0 ? (
                        <Virtuoso
                            useWindowScroll
                            totalCount={notifications.length}
                            overscan={200}
                            itemContent={(index) => {
                                const note = notifications[index];
                                return (
                                    <div className="pb-3">
                                        <button
                                            onClick={() => handleItemClick(note.link, note.id)}
                                            className={`w-full flex items-start gap-4 p-5 text-left border rounded-2xl transition-all duration-300 group ${
                                                !note.isRead 
                                                ? 'bg-panel-primary border-white/10 hover:border-white/20 shadow-lg shadow-black/20' 
                                                : 'bg-transparent border-transparent hover:bg-white/5'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center border border-white/10 ${
                                                note.type === 'system' ? 'bg-purple-500/20 text-purple-400' :
                                                note.type === 'release' ? 'bg-green-500/20 text-green-400' :
                                                note.type === 'like' ? 'bg-red-500/20 text-red-400' :
                                                'bg-item-primary text-gray-400'
                                            }`}>
                                                {note.image ? (
                                                    <img src={note.image} alt="" className="w-full h-full object-cover rounded-full" />
                                                ) : (
                                                    <i className={`fa-solid ${
                                                        note.type === 'system' ? 'fa-gear' :
                                                        note.type === 'release' ? 'fa-play' :
                                                        note.type === 'like' ? 'fa-heart' :
                                                        'fa-comment'
                                                    } text-lg`}></i>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <span className={`text-base font-bold truncate pr-2 transition-colors ${!note.isRead ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                                        {note.title}
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{getTimeLabel(note.time)}</span>
                                                        {!note.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-400 leading-relaxed">{note.description}</p>
                                            </div>
                                        </button>
                                    </div>
                                );
                            }}
                        />
                    ) : (
                        <EmptyState 
                            icon="fa-regular fa-bell-slash"
                            title={t('layout.navbar.notifications.empty')}
                            description="Здесь пока ничего нет."
                            className="bg-panel-primary border-dashed border-white/10 min-h-[300px]"
                        />
                    )}
                </div>

                <HistoryClearModal 
                    isOpen={isClearModalOpen}
                    onClose={() => setIsClearModalOpen(false)}
                    onConfirm={handleClearByPeriod}
                    title="Очистить уведомления"
                    allTimeLabel="Все уведомления"
                />

            </div>
        </div>
    );
};

export default Notifications;