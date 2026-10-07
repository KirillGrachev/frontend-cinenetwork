import React from 'react';

const HomeSkeleton: React.FC = () => {
    return (
        <div className="relative z-10 bg-background-primary pb-20 pt-32 flex flex-col gap-10 md:gap-12">
            {/* Banner Skeleton */}
            <div className="container mx-auto px-4 md:px-8 pb-8">
                <div className="w-full aspect-[2/1] md:aspect-[3/1] bg-panel-primary rounded-3xl border border-border-medium relative overflow-hidden flex flex-col justify-between p-6 md:p-10">
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                    <div className="relative z-10">
                        <div className="w-28 h-6 bg-white/10 rounded-full"></div>
                        <div className="space-y-3 mt-4">
                            <div className="h-7 md:h-10 w-2/3 md:w-1/2 bg-white/15 rounded-xl"></div>
                            <div className="h-4 md:h-5 w-1/3 bg-white/10 rounded-md"></div>
                        </div>
                    </div>
                    {/* Dots Skeleton */}
                    <div className="absolute bottom-3 md:bottom-5 left-0 right-0 flex justify-center gap-2 z-10">
                        <div className="h-1.5 w-6 md:w-8 bg-white/40 rounded-full"></div>
                        <div className="h-1.5 w-1.5 bg-white/10 rounded-full"></div>
                        <div className="h-1.5 w-1.5 bg-white/10 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Anime Rows Skeletons (Simulating 4 rows: Trending, New, Best, Movies) */}
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="container mx-auto px-4 md:px-8">
                    {/* Header Skeleton with Title & Show More link */}
                    <div className="flex justify-between items-end mb-5">
                        <div className="h-7 md:h-8 w-44 md:w-56 bg-white/15 rounded-xl"></div>
                        <div className="h-5 w-28 md:w-36 bg-white/10 rounded-lg"></div>
                    </div>

                    {/* Cards Row Skeleton */}
                    <div className="flex gap-4 md:gap-6 overflow-hidden pb-4">
                        {Array.from({ length: 6 }).map((__, j) => (
                            <div 
                                key={j} 
                                className="w-[140px] md:w-[240px] flex-shrink-0 aspect-[2/3] bg-panel-primary rounded-2xl border border-white/10 relative overflow-hidden shadow-sm"
                            >
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                                {/* Rating Badge Skeleton */}
                                <div className="absolute top-3 left-3 w-[42px] h-[28px] bg-white/10 rounded-xl"></div>
                                
                                {/* Bottom Title & Meta Skeleton */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                                    <div className="h-5 w-4/5 bg-white/15 rounded-md"></div>
                                    <div className="h-4 w-1/2 bg-white/10 rounded-md"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HomeSkeleton;
