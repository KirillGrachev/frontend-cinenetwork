import React from 'react';

const StudioPageSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-primary pt-24 pb-20">
            <div className="container mx-auto px-4 md:px-8">
                {/* Back Button Skeleton */}
                <div className="h-9 w-24 bg-white/10 rounded-xl mb-8 skeleton-shimmer"></div>

                {/* Header Skeleton */}
                <div className="mb-12 skeleton-shimmer">
                    <div className="h-5 w-28 bg-white/10 rounded-md mb-4"></div>
                    <div className="h-10 md:h-16 w-64 md:w-96 bg-white/15 rounded-2xl mb-4"></div>
                    <div className="h-5 w-32 bg-white/10 rounded-md"></div>
                </div>

                {/* Grid Skeleton */}
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

export default StudioPageSkeleton;
