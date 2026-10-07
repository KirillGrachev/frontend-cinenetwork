import React from 'react';
import WatchPageLayout from '../layouts/WatchPageLayout';
import Skeleton from '../ui/Skeleton';

const WatchPageSkeleton: React.FC = () => {
    return (
        <WatchPageLayout
            isSkeleton={true}
            backButton={
                <Skeleton className="h-9 w-24 rounded-xl" />
            }
            leftColumn={
                <>
                    {/* Player Skeleton */}
                    <Skeleton className="w-full aspect-video rounded-2xl mb-8" />
                    
                    {/* Info Skeleton */}
                    <div className="space-y-4 mb-8">
                        <Skeleton className="h-8 md:h-10 w-3/4 rounded-xl" />
                        <Skeleton className="h-6 w-1/4 rounded-md" />
                        <Skeleton className="h-12 w-full rounded-2xl" />
                    </div>
                    
                    {/* Comments Section Skeleton */}
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-48 rounded-xl" />
                        <Skeleton className="h-24 w-full rounded-2xl" />
                        <div className="space-y-4 mt-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                                    <div className="flex-1 space-y-2 pt-2">
                                        <Skeleton className="h-4 w-32 rounded-md" />
                                        <Skeleton className="h-4 w-full rounded-md" />
                                        <Skeleton className="h-4 w-5/6 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            }
            rightColumn={
                <div className="h-[400px] bg-panel-secondary rounded-2xl border border-white/10 p-4">
                    <Skeleton className="h-6 w-32 rounded-md mb-6" />
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-16 w-full rounded-xl" />
                        ))}
                    </div>
                </div>
            }
        />
    );
};

export default WatchPageSkeleton;
