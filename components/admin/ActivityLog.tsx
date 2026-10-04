import React from 'react';
import { useNavigate } from 'react-router';
import SmartList from '../ui/SmartList';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import Input from '../ui/Input';
import ActivityLogItem from './activity/ActivityLogItem';
import { useActivityLogLogic } from '../../hooks/useActivityLogLogic';
import { useLocale } from '../../context/LocaleContext';
import { ActivityType, FILTER_ALL, AppRoute, AdminTab } from '../../types';
import ActivityLogSkeleton from '../skeletons/ActivityLogSkeleton';

const ActivityLog: React.FC = () => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const { state, actions } = useActivityLogLogic();
    const { isLoading, visibleLogs, filterType, searchUser } = state;

    if (isLoading) {
        return <ActivityLogSkeleton />;
    }

    const handleBack = () => {
        // Navigate back to AdminStats but explicitly open the System tab
        navigate(AppRoute.AdminStats, { state: { activeTab: AdminTab.System } });
    };

    // Filter Configuration
    const filters = [
        {
            id: FILTER_ALL,
            label: t('admin.activityLog.allEvents'),
            icon: 'fa-solid fa-layer-group',
        },
        {
            id: ActivityType.Success,
            label: t('admin.activityLog.types.success'),
            icon: 'fa-solid fa-circle-check text-green-500',
        },
        {
            id: ActivityType.Info,
            label: t('admin.activityLog.types.info'),
            icon: 'fa-solid fa-circle-info text-blue-500',
        },
        {
            id: ActivityType.Warning,
            label: t('admin.activityLog.types.warning'),
            icon: 'fa-solid fa-triangle-exclamation text-yellow-500',
        },
    ];

    const currentFilter = filters.find((f) => f.id === filterType) || filters[0];

    const handleCycleFilter = () => {
        const currentIndex = filters.findIndex((f) => f.id === filterType);
        const nextIndex = (currentIndex + 1) % filters.length;
        actions.setFilterType(filters[nextIndex].id as typeof FILTER_ALL | ActivityType);
    };

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-8 h-full flex flex-col">
                <div className="mb-8 animate-fade-in">
                    <Button
                        variant="ghost"
                        size="md"
                        icon="fa-solid fa-arrow-left"
                        onClick={handleBack}
                        className="pl-0 hover:!bg-transparent hover:text-white"
                    >
                        {t('admin.title')}
                    </Button>
                </div>

                <PageHeader
                    title={t('admin.activityLog.fullLogTitle')}
                    description={t('admin.activityLog.fullLogDescription')}
                    className="!mb-8"
                />

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in stagger-1 items-center">
                    <div className="w-full md:flex-1">
                        <Input
                            placeholder={t('admin.activityLog.searchPlaceholder')}
                            value={searchUser}
                            onChange={(e) => actions.setSearchUser(e.target.value)}
                            className="bg-panel-primary border-border-light"
                            rightIcon="fa-solid fa-magnifying-glass"
                        />
                    </div>

                    <div className="w-full md:w-auto">
                        <Button
                            variant="black"
                            size="md"
                            onClick={handleCycleFilter}
                            className="rounded-xl font-medium min-w-full md:min-w-[220px] group transition-all !px-4"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <i
                                        className={`${currentFilter.icon} group-hover:opacity-80 transition-opacity`}
                                    ></i>
                                    <span>{currentFilter.label}</span>
                                </div>
                                <div className="bg-white/10 rounded-full w-6 h-6 flex items-center justify-center ml-3 group-hover:bg-black/10 transition-colors">
                                    <i className="fa-solid fa-rotate text-[10px] text-gray-400 group-hover:text-black transition-colors"></i>
                                </div>
                            </div>
                        </Button>
                    </div>
                </div>

                {/* Virtualized List Container */}
                <div className="flex-1 min-h-[600px]  rounded-3xl bg-panel-primary overflow-hidden animate-fade-in stagger-2 shadow-xl">
                    {visibleLogs.length > 0 ? (
                        <SmartList
                            style={{ height: '600px' }}
                            totalCount={visibleLogs.length}
                            itemContent={(index) => (
                                <div className="px-4 py-2">
                                    <ActivityLogItem log={visibleLogs[index]} />
                                </div>
                            )}
                            className="custom-scrollbar"
                        />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center bg-white/5">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fa-solid fa-list-ul text-2xl text-gray-500"></i>
                            </div>
                            <p className="text-gray-400 text-sm font-medium">
                                {t('admin.activityLog.empty')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityLog;
