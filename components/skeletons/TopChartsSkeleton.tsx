import React from 'react';

const TopChartsSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-primary pt-32 pb-20 animate-pulse">
            <div className="container mx-auto px-4 md:px-8">
                {/* Back Button Skeleton */}
                <div className="h-9 w-24 bg-white/10 rounded-xl mb-8"></div>

                {/* Header & Metric Selector Skeleton */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <div className="h-10 w-56 bg-white/15 rounded-2xl mb-2"></div>
                        <div className="h-5 w-72 bg-white/10 rounded-md"></div>
                    </div>
                    <div className="w-full md:w-48 h-12 bg-panel-primary border border-border-medium rounded-2xl"></div>
                </div>

                {/* Periods Tabs Skeleton */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-10 pb-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-11 w-28 bg-panel-primary border border-border-light rounded-full shrink-0"></div>
                    ))}
                </div>

                {/* Chart Items List Skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex gap-4 p-3 md:p-4 bg-panel-primary border border-border-medium rounded-2xl items-center h-28 md:h-32">
                            <div className="h-8 w-8 bg-white/10 rounded-full shrink-0"></div>
                            <div className="w-16 h-20 sm:w-20 sm:h-24 md:w-20 md:h-24 bg-white/10 rounded-xl shrink-0"></div>
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-5 w-3/4 bg-white/15 rounded-md"></div>
                                <div className="h-4 w-1/4 bg-white/10 rounded-md"></div>
                                <div className="h-4 w-1/3 bg-white/10 rounded-md"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopChartsSkeleton;