import React, { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import Select from '../ui/Select';
import LoadingSpinner from '../LoadingSpinner';
import { useLocale } from '../../context/LocaleContext';
import { useAdminStats } from '../../hooks/useAdminStats';
import { AdminTab, AdminPeriod, AppRoute } from '../../types';

// Import Tabs
import OverviewTab from './stats/OverviewTab';
import ContentTab from './stats/ContentTab';
import FinanceTab from './stats/FinanceTab';
import SystemTab from './stats/SystemTab';

const Stats: React.FC = () => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const { state, actions } = useAdminStats();
    const {
        isLoading,
        metrics,
        trafficHistory,
        contentDistribution,
        topContent,
        transactions,
        platformStats,
        activityLog,
        activePeriod,
    } = state;

    // Determine active tab from URL param, default to Overview
    const tabParam = searchParams.get('tab');
    const activeTab = Object.values(AdminTab).includes(tabParam as AdminTab)
        ? (tabParam as AdminTab)
        : AdminTab.Overview;

    // Effect to handle navigation state (e.g. returning from Activity Log to System tab)
    // or setting default tab in URL if missing
    useEffect(() => {
        if (location.state && location.state.activeTab) {
            setSearchParams({ tab: location.state.activeTab }, { replace: true });
            // Clear state to avoid persistent redirect behavior on reload
            window.history.replaceState({}, document.title);
        } else if (!tabParam) {
            // If no tab param exists, set default to keep URL consistent
            setSearchParams({ tab: AdminTab.Overview }, { replace: true });
        }
    }, [location.state, tabParam, setSearchParams]);

    // Icons removed as requested for the tab buttons
    const tabs: { id: AdminTab; label: string }[] = [
        { id: AdminTab.Overview, label: t('admin.tabs.overview') },
        { id: AdminTab.Content, label: t('admin.tabs.content') },
        { id: AdminTab.Finance, label: t('admin.tabs.finance') },
        { id: AdminTab.System, label: t('admin.tabs.system') },
    ];

    const periods = [
        { value: AdminPeriod.Day24, label: t('admin.periods.d24') },
        { value: AdminPeriod.Day7, label: t('admin.periods.d7') },
        { value: AdminPeriod.Day30, label: t('admin.periods.d30') },
    ];

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-8">
                <PageHeader
                    title={t('admin.title')}
                    description={t('admin.description')}
                    className="!mb-8"
                    actions={
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            {/* Period Selector */}
                            <div className="w-40">
                                <Select
                                    value={activePeriod}
                                    onChange={(val) => actions.setActivePeriod(val as AdminPeriod)}
                                    options={periods}
                                    prefixIcon="fa-regular fa-calendar"
                                    variant="solid"
                                    size="md"
                                />
                            </div>

                            <div className="hidden md:flex gap-3">
                                <Button
                                    variant="secondary"
                                    size="md"
                                    icon="fa-solid fa-users"
                                    className="rounded-xl "
                                    onClick={() => navigate(AppRoute.AdminUsers)}
                                >
                                    {t('admin.goToUsers')}
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="md"
                                    icon="fa-regular fa-comments"
                                    className="rounded-xl "
                                    onClick={() => navigate(AppRoute.AdminModeration)}
                                >
                                    {t('admin.goToComments')}
                                </Button>
                            </div>
                        </div>
                    }
                />

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-3 mb-10 animate-fade-in stagger-1">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setSearchParams({ tab: tab.id })}
                                className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border ${
                                    isActive
                                        ? 'bg-white text-black border-white shadow-sm'
                                        : 'bg-panel-primary text-gray-400 border-border-light hover:border-border-medium hover:text-white hover:bg-panel-secondary'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* --- TAB CONTENT --- */}
                <div className="min-h-[600px]">
                    {activeTab === AdminTab.Overview && (
                        <OverviewTab metrics={metrics} trafficHistory={trafficHistory} t={t} />
                    )}

                    {activeTab === AdminTab.Content && (
                        <ContentTab
                            contentDistribution={contentDistribution}
                            topContent={topContent}
                            t={t}
                        />
                    )}

                    {activeTab === AdminTab.Finance && (
                        <FinanceTab transactions={transactions} t={t} />
                    )}

                    {activeTab === AdminTab.System && (
                        <SystemTab platformStats={platformStats} activityLog={activityLog} t={t} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Stats;
