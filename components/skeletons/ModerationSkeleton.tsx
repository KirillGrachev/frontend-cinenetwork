import React from 'react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import { useLocale } from '../../context/LocaleContext';

const ModerationSkeleton: React.FC = () => {
    const { t } = useLocale();

    return (
        <div className="min-h-screen pt-32 pb-20 page-reveal">
            <div className="container mx-auto px-4 md:px-8 h-full flex flex-col">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        size="md"
                        icon="fa-solid fa-arrow-left"
                        disabled
                        className="pl-0 opacity-50"
                    >
                        {t('admin.title')}
                    </Button>
                </div>

                <div className="mb-8">
                    <Skeleton className="h-10 w-64 rounded-xl mb-4" />
                    <Skeleton className="h-4 w-96 rounded" />
                </div>

                {/* Tabs & Filters */}
                <div className="flex flex-col md:flex-row items-center justify-start mb-8 gap-3">
                    <div className="bg-panel-primary p-1 rounded-full inline-flex h-14 items-center">
                        <Skeleton className="h-12 w-32 rounded-full" />
                        <Skeleton className="h-12 w-32 rounded-full" />
                        <Skeleton className="h-12 w-32 rounded-full" />
                    </div>
                    <Skeleton className="h-14 w-[200px] rounded-full" />
                </div>

                {/* Cards List */}
                <div className="flex-1 min-h-[600px] space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-panel-primary p-6 rounded-3xl border border-border-medium skeleton-shimmer"
                        >
                            <div className="flex gap-4">
                                <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <Skeleton className="h-5 w-40 rounded" />
                                            <Skeleton className="h-4 w-24 rounded" />
                                        </div>
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                    </div>
                                    <Skeleton className="h-4 w-full rounded" />
                                    <Skeleton className="h-4 w-3/4 rounded" />
                                    <div className="flex gap-2 pt-2">
                                        <Skeleton className="h-10 w-24 rounded-lg" />
                                        <Skeleton className="h-10 w-24 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ModerationSkeleton;
