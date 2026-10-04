import React from 'react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import PageHeader from '../ui/PageHeader';
import { useLocale } from '../../context/LocaleContext';

const StatusPageSkeleton: React.FC = () => {
    const { t } = useLocale();

    return (
        <div className="min-h-[calc(100vh-120px)] pt-32 pb-20 select-none flex flex-col justify-between">
            <div className="container mx-auto px-4 md:px-8 flex-1">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        size="md"
                        icon="fa-solid fa-arrow-left"
                        disabled
                        className="pl-0 opacity-50"
                    >
                        {t('status.backToHome')}
                    </Button>
                </div>

                <PageHeader title={t('status.title')} description={t('status.description')} />

                <div className="space-y-12">
                    {/* System Health Skeleton */}
                    <div className="mb-12">
                        <div className="rounded-2xl p-6 md:p-8 flex items-center justify-center gap-4 md:gap-6 border bg-white/5 border-white/5 animate-pulse min-h-[82px] md:min-h-[98px]">
                            <Skeleton className="w-4 h-4 rounded-full" />
                            <Skeleton className="h-8 w-64 rounded-lg" />
                        </div>
                    </div>

                    {/* Service List Skeleton */}
                    <div className="space-y-8">
                        {[3, 2, 2].map((itemCount, i) => (
                            <div
                                key={i}
                                className="bg-background-secondary rounded-3xl border border-border-medium overflow-hidden shadow-xl"
                            >
                                <div className="px-6 py-4 border-b border-border-light bg-panel-primary min-h-[57px] flex items-center">
                                    <Skeleton className="h-6 w-32 rounded-lg" />
                                </div>
                                <div className="divide-y divide-border-light">
                                    {Array.from({ length: itemCount }).map((_, j) => (
                                        <div
                                            key={j}
                                            className="p-4 md:p-6 flex justify-between items-center h-[73px] animate-pulse"
                                        >
                                            <div className="flex items-center gap-4">
                                                <Skeleton className="w-3 h-3 rounded-full" />
                                                <Skeleton className="h-5 w-40 rounded" />
                                            </div>
                                            <div className="flex gap-12">
                                                <Skeleton className="h-4 w-20 rounded hidden md:block" />
                                                <Skeleton className="h-8 w-24 rounded-full hidden md:block" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusPageSkeleton;
