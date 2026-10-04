import React from 'react';
import PageHeader from './ui/PageHeader';
import { useLocale } from '../context/LocaleContext';
import { useScheduleLogic } from '../hooks/useScheduleLogic';
import ScheduleDaySelector from './schedule/ScheduleDaySelector';
import ScheduleHeader from './schedule/ScheduleHeader';
import ScheduleGrid from './schedule/ScheduleGrid';
import SEO from './SEO';
import ScheduleSkeleton from './skeletons/ScheduleSkeleton';

const Schedule: React.FC = () => {
    const { t } = useLocale();
    const { state, actions } = useScheduleLogic();

    if (state.isLoading) {
        return (
            <>
                <SEO title={t('schedule.title')} description={t('schedule.description')} />
                <ScheduleSkeleton />
            </>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20">
            <SEO title={t('schedule.title')} description={t('schedule.description')} />
            <div className="container mx-auto px-4 md:px-8">
                <PageHeader title={t('schedule.title')} description={t('schedule.description')} />

                <ScheduleDaySelector
                    days={state.scheduleDays}
                    activeDay={state.activeDay}
                    onSelect={actions.setActiveDay}
                />

                {!state.error && (
                    <ScheduleHeader
                        count={state.totalItemsCount}
                        sortOrder={state.sortOrder}
                        onToggleSort={actions.toggleSort}
                    />
                )}

                <ScheduleGrid
                    isLoading={state.isLoading}
                    error={state.error}
                    items={state.items}
                    placeholdersCount={state.placeholdersCount}
                    sortOrder={state.sortOrder}
                    activeDay={state.activeDay}
                    currentPage={state.currentPage}
                    totalPages={state.totalPages}
                    onPageChange={actions.setPage}
                />
            </div>
        </div>
    );
};

export default Schedule;
