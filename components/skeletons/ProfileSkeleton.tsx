import React from 'react';

const ProfileSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-primary pb-20">
            {/* Banner Skeleton */}
            <div className="h-64 md:h-80 w-full bg-panel-primary relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            </div>

            {/* Header Content Skeleton */}
            <div className="container mx-auto px-4 md:px-8 relative z-10 -mt-20">
                <div className="flex flex-col md:flex-row items-end gap-6 md:gap-8">
                    {/* Avatar Skeleton */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background-primary bg-panel-secondary shrink-0"></div>
                    <div className="flex-1 w-full pb-2">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div>
                                <div className="h-8 md:h-10 w-48 bg-white/15 rounded-xl mb-2"></div>
                                <div className="h-4 w-64 bg-white/10 rounded-md"></div>
                            </div>
                            <div className="h-10 w-32 bg-white/10 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="container mx-auto px-4 md:px-8 mt-12 mb-8">
                <div className="flex gap-8 border-b border-white/10 pb-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-6 w-24 bg-white/10 rounded-md shrink-0"></div>
                    ))}
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="h-48 w-full bg-panel-primary border border-white/5 rounded-2xl"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileSkeleton;
