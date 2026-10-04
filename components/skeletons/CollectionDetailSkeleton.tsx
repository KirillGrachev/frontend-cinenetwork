import React from 'react';

const CollectionDetailSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-primary pt-24 pb-20">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row items-end gap-8 mb-12 skeleton-shimmer">
                    <div className="flex-1 w-full">
                        <div className="h-5 w-40 bg-white/10 rounded-md mb-5"></div>
                        <div className="h-10 md:h-16 w-3/4 bg-white/15 rounded-2xl mb-6"></div>
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-28 bg-white/10 rounded-full"></div>
                            <div className="h-5 w-32 bg-white/10 rounded-md"></div>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="h-12 w-32 bg-white/20 rounded-xl"></div>
                        <div className="h-12 w-48 bg-white/10 rounded-xl"></div>
                    </div>
                </div>

                {/* Content Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-20">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                        <div
                            key={i}
                            className="aspect-[2/3] w-full bg-panel-secondary rounded-2xl border border-white/10 shadow-lg relative overflow-hidden"
                        >
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CollectionDetailSkeleton;
