import React from 'react';
import AnimePageLayout from '../layouts/AnimePageLayout';
import Skeleton from '../ui/Skeleton';

const AnimePageSkeleton: React.FC = () => {
    return (
        <AnimePageLayout
            isSkeleton={true}
            heroBackground={
                <>
                    <div className="absolute inset-0 bg-panel-secondary/40"></div>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]"></div>
                </>
            }
            heroContent={
                <>
                    {/* Back Button Skeleton */}
                    <div className="absolute top-24 left-4 md:left-8 z-30">
                        <Skeleton className="h-9 w-24 rounded-xl" />
                    </div>

                    {/* Desktop Poster Skeleton */}
                    <Skeleton className="hidden md:block w-64 2xl:w-80 aspect-[2/3] rounded-2xl shrink-0 shadow-2xl" />

                    {/* Info */}
                    <div className="flex-1 w-full">
                        {/* Mobile Poster Skeleton */}
                        <Skeleton className="md:hidden w-28 aspect-[2/3] rounded-xl mb-4" />

                        {/* Title Skeleton */}
                        <Skeleton className="h-8 sm:h-10 md:h-14 2xl:h-16 w-3/4 rounded-2xl mb-2" />

                        {/* Meta Skeleton */}
                        <div className="flex items-center gap-3 mb-6">
                            <Skeleton className="h-5 md:h-6 w-16 rounded-md" />
                            <Skeleton className="h-5 md:h-6 w-12 rounded-md" />
                            <span className="w-1 h-1 rounded-full bg-white/10"></span>
                            <Skeleton className="h-5 md:h-6 w-16 rounded-md" />
                        </div>

                        {/* Buttons Skeleton */}
                        <div className="flex flex-wrap gap-3">
                            <Skeleton className="h-12 md:h-14 flex-1 md:flex-none md:w-44 rounded-xl" />
                            <Skeleton className="h-12 md:h-14 min-w-[200px] w-full md:w-auto md:w-[220px] rounded-xl" />
                        </div>
                    </div>
                </>
            }
            tabs={[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-5 w-24 rounded-md shrink-0" />
            ))}
            mainContent={
                <>
                    <div>
                        <Skeleton className="h-7 w-36 rounded-lg mb-4" />
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-11/12 rounded-md" />
                            <Skeleton className="h-4 w-4/5 rounded-md" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-16 rounded-2xl" />
                        ))}
                    </div>
                </>
            }
            sideContent={
                <>
                    <Skeleton className="h-7 w-28 rounded-lg mb-4" />
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="aspect-video rounded-xl" />
                        ))}
                    </div>
                </>
            }
        />
    );
};

export default AnimePageSkeleton;
