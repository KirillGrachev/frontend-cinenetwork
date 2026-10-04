import React from 'react';

const HistorySkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-primary pt-32 pb-20 skeleton-shimmer">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header Skeleton */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="h-10 w-48 bg-white/15 rounded-2xl mb-3"></div>
                    <div className="h-5 w-72 bg-white/10 rounded-md"></div>
                </div>

                {/* History Cards Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="bg-panel-primary border border-white/5 rounded-2xl flex flex-row h-28 md:h-32 overflow-hidden"
                        >
                            <div className="w-24 md:w-48 bg-white/10 shrink-0"></div>
                            <div className="flex-1 p-3 flex flex-col justify-between">
                                <div>
                                    <div className="h-5 w-3/4 bg-white/15 rounded-md mb-2"></div>
                                    <div className="flex gap-2">
                                        <div className="h-5 w-16 bg-white/10 rounded-full"></div>
                                        <div className="h-5 w-20 bg-white/10 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="h-4 w-24 bg-white/10 rounded-md"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HistorySkeleton;
