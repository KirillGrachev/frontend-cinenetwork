import React from 'react';
import PageHeader from '../ui/PageHeader';
import { useLocale } from '../../context/LocaleContext';

const ScheduleSkeleton: React.FC = () => {
    const { t } = useLocale();

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-8">
                <PageHeader title={t('schedule.title')} description={t('schedule.description')} />

                {/* Days Selector Skeleton */}
                <div className="mb-10 animate-pulse">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-[90px] rounded-xl border border-border-medium bg-panel-primary flex flex-col items-center justify-center gap-2 p-3"
                            >
                                <div className="h-3 w-16 bg-white/5 rounded"></div>
                                <div className="h-7 w-8 bg-white/10 rounded-md"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Header Skeleton */}
                <div className="flex items-center justify-between mb-6 animate-pulse">
                    <div className="h-6 w-40 bg-white/5 rounded-lg border border-white/5"></div>
                    <div className="h-12 w-[220px] bg-white/5 rounded-xl border border-white/5"></div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 min-h-[600px] animate-pulse">
                    {Array.from({ length: 10 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="aspect-[2/3] w-full bg-white/10 rounded-2xl"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScheduleSkeleton;
