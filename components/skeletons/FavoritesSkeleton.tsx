import React from 'react';

const FavoritesSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-primary pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-8">
                {/* Page Header Skeleton */}
                <div className="flex flex-col items-center text-center mb-8 animate-pulse">
                    <div className="h-10 w-48 bg-white/15 rounded-2xl mb-3"></div>
                    <div className="h-5 w-72 bg-white/10 rounded-md"></div>
                </div>

                {/* Controls Skeleton */}
                <div className="flex flex-col md:flex-row items-center justify-center mb-10 gap-3 animate-pulse">
                    <div className="h-14 w-64 bg-panel-primary rounded-full border border-white/5"></div>
                    <div className="h-14 w-48 bg-panel-primary rounded-full border border-white/5"></div>
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

export default FavoritesSkeleton;
