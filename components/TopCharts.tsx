import React from 'react';
import { useNavigate } from 'react-router';
import { Virtuoso } from 'react-virtuoso';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';
import Select from './ui/Select';
import TopChartItem from './top-charts/TopChartItem';
import { useLocale } from '../context/LocaleContext';
import { useTopChartsLogic } from '../hooks/useTopChartsLogic';
import { TopPeriod, TopMetric, AppRoute } from '../types';
import TopChartsSkeleton from './skeletons/TopChartsSkeleton';

const TopCharts: React.FC = () => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const { state, actions } = useTopChartsLogic();
    const { items, isLoading, period, metric } = state;

    const periods = [
        { id: TopPeriod.Week, label: t('topCharts.periods.week') },
        { id: TopPeriod.Month, label: t('topCharts.periods.month') },
        { id: TopPeriod.Year, label: t('topCharts.periods.year') },
        { id: TopPeriod.AllTime, label: t('topCharts.periods.all') },
    ];

    const metricOptions = [
        { value: TopMetric.Views, label: t('topCharts.metrics.views') },
        { value: TopMetric.Rating, label: t('topCharts.metrics.rating') },
    ];

    const handleItemClick = (id: number) => {
        navigate(`/anime/${id}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleItemClick(id);
        }
    };

    if (isLoading) {
        return <TopChartsSkeleton />;
    }

    // Dynamic title based on active metric
    const pageTitle =
        metric === TopMetric.Views ? t('topCharts.titleViews') : t('topCharts.titleRating');

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-8 h-full flex flex-col">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        size="md"
                        icon="fa-solid fa-arrow-left"
                        onClick={() => navigate(AppRoute.Home)}
                        className="pl-0 hover:!bg-transparent hover:text-white"
                    >
                        {t('navbar.backToHome')}
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <PageHeader
                        title={pageTitle}
                        description={t('topCharts.description')}
                        className="!mb-0"
                    />

                    {/* Metric Selector */}
                    <div className="w-full md:w-48 animate-fade-in stagger-1 relative z-30">
                        <Select
                            value={metric}
                            onChange={(val) => actions.setMetric(val as TopMetric)}
                            options={metricOptions}
                            variant="solid"
                            size="md"
                            prefixIcon={
                                metric === TopMetric.Views
                                    ? 'fa-solid fa-eye'
                                    : 'fa-solid fa-trophy'
                            }
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto no-scrollbar gap-2 mb-10 pb-2 animate-fade-in stagger-1">
                    {periods.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => actions.setPeriod(p.id)}
                            className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
                                period === p.id
                                    ? 'bg-white text-black border-white'
                                    : 'bg-panel-primary text-gray-400 border-border-light hover:text-white hover:bg-panel-secondary'
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                {/* Virtualized List */}
                <div className="flex-1 min-h-[600px] animate-fade-in stagger-2">
                    <Virtuoso
                        useWindowScroll
                        totalCount={items.length}
                        overscan={1200}
                        itemContent={(index) => {
                            const anime = items[index];
                            return (
                                <div className="pb-4">
                                    <TopChartItem
                                        anime={anime}
                                        rank={index + 1}
                                        metric={metric}
                                        onClick={() => handleItemClick(anime.id)}
                                        onKeyDown={(e) => handleKeyDown(e, anime.id)}
                                    />
                                </div>
                            );
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TopCharts;
