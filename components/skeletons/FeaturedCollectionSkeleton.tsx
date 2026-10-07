import React from 'react';
import Skeleton from '../ui/Skeleton';

const FeaturedCollectionSkeleton: React.FC = () => {
    return (
        <div className="mb-12 w-full h-[400px] md:h-[500px] bg-panel-primary rounded-[40px] border border-border-medium overflow-hidden relative">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            
            {/* Content overlay */}
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-10">
                <div className="max-w-3xl space-y-4">
                    <Skeleton className="h-6 w-32 rounded-full" />
                    <Skeleton className="h-10 md:h-16 w-3/4 rounded-xl" />
                    <Skeleton className="h-5 md:h-6 w-full rounded-lg" />
                    <Skeleton className="h-5 md:h-6 w-2/3 rounded-lg" />
                    
                    <div className="flex gap-4 mt-6">
                        <Skeleton className="h-12 w-32 rounded-xl" />
                        <Skeleton className="h-12 w-12 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedCollectionSkeleton;
