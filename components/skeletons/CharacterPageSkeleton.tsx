import React from 'react';

const CharacterPageSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-primary pt-24 pb-20 animate-pulse">
            <div className="container mx-auto px-4 md:px-8">
                {/* Back Button Skeleton */}
                <div className="h-9 w-24 bg-white/10 rounded-xl mb-8"></div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                    {/* Left Column Skeleton */}
                    <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
                        <div className="w-full aspect-[2/3] rounded-[32px] bg-panel-secondary border border-white/10 shadow-2xl"></div>
                        <div className="h-24 w-full bg-panel-secondary border border-border-medium rounded-2xl p-4"></div>
                    </div>

                    {/* Right Column Skeleton */}
                    <div className="flex-1 w-full min-w-0">
                        <div className="mb-10">
                            <div className="h-10 md:h-16 w-3/4 bg-white/15 rounded-2xl mb-3"></div>
                            <div className="h-6 w-1/3 bg-white/10 rounded-md mb-4"></div>
                            <div className="h-7 w-28 bg-white/10 rounded-lg"></div>
                        </div>

                        <div className="mb-14">
                            <div className="h-7 w-36 bg-white/10 rounded-lg mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-4 w-full bg-white/10 rounded-md"></div>
                                <div className="h-4 w-11/12 bg-white/10 rounded-md"></div>
                                <div className="h-4 w-4/5 bg-white/10 rounded-md"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                                <div className="h-8 w-48 bg-white/10 rounded-lg"></div>
                                <div className="h-7 w-24 bg-white/10 rounded-lg"></div>
                            </div>
                            <div className="flex gap-4 md:gap-6 overflow-hidden">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="w-[160px] md:w-[220px] aspect-[2/3] bg-panel-secondary rounded-2xl border border-white/10 shrink-0"
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharacterPageSkeleton;
