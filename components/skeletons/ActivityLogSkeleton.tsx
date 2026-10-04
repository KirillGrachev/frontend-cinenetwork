import React from 'react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import { useLocale } from '../../context/LocaleContext';

const ActivityLogSkeleton: React.FC = () => {
    const { t } = useLocale();

    return (
        <div className="min-h-screen pt-32 pb-20 animate-fade-in">
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

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
                    <div className="w-full md:flex-1">
                        <Skeleton className="h-12 w-full rounded-2xl" />
                    </div>
                    <div className="w-full md:w-auto">
                        <Skeleton className="h-12 w-full md:w-[220px] rounded-xl" />
                    </div>
                </div>

                {/* List Container */}
                <div className="flex-1 min-h-[600px] rounded-3xl bg-panel-primary overflow-hidden shadow-xl p-4 space-y-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex gap-4 p-4 bg-white/5 rounded-2xl animate-pulse"
                        >
                            <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-1/4 rounded" />
                                    <Skeleton className="h-4 w-20 rounded" />
                                </div>
                                <Skeleton className="h-4 w-3/4 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivityLogSkeleton;
