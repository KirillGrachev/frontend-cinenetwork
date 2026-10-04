import React from 'react';
import PageHeader from '../ui/PageHeader';
import { getNewsPageConfig } from '../../constants';
import { useLocale } from '../../context/LocaleContext';

const NewsSkeleton: React.FC = () => {
    const { t } = useLocale();
    const NEWS_PAGE_CONFIG = getNewsPageConfig(t);
    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header */}
                <PageHeader
                    title={NEWS_PAGE_CONFIG.title}
                    description={NEWS_PAGE_CONFIG.description}
                />

                {/* Featured Post Skeleton */}
                <div className="mb-6 w-full h-full min-h-[350px] bg-background-secondary border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between skeleton-shimmer">
                    <div className="flex gap-3 mb-4">
                        <div className="h-[28px] w-32 bg-white/5 rounded-lg"></div>
                        <div className="h-[28px] w-20 bg-white/5 rounded-lg"></div>
                    </div>
                    <div className="mb-8">
                        <div className="h-8 w-3/4 bg-white/10 rounded-xl mb-4"></div>
                        <div className="h-4 w-full bg-white/5 rounded-full mb-2"></div>
                        <div className="h-4 w-2/3 bg-white/5 rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-end mt-auto">
                        <div className="flex gap-2">
                            <div className="h-[24px] w-16 bg-white/5 rounded-lg"></div>
                            <div className="h-[24px] w-20 bg-white/5 rounded-lg"></div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white/5 shrink-0"></div>
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {Array.from({
                        length: 6,
                    }).map((_, i) => (
                        <div
                            key={i}
                            className="h-full min-h-[280px] bg-background-secondary border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between skeleton-shimmer"
                        >
                            <div className="flex gap-3 mb-4">
                                <div className="h-[28px] w-32 bg-white/5 rounded-lg"></div>
                                <div className="h-[28px] w-20 bg-white/5 rounded-lg"></div>
                            </div>
                            <div className="mb-8">
                                <div className="h-7 w-4/5 bg-white/10 rounded-xl mb-3"></div>
                                <div className="h-4 w-full bg-white/5 rounded-full mb-2"></div>
                                <div className="h-4 w-1/2 bg-white/5 rounded-full"></div>
                            </div>
                            <div className="flex justify-between items-end mt-auto">
                                <div className="flex gap-2">
                                    <div className="h-[24px] w-16 bg-white/5 rounded-lg"></div>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-white/5 shrink-0"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsSkeleton;
