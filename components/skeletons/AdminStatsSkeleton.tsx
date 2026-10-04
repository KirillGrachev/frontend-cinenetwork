import React from 'react';
import Skeleton from '../ui/Skeleton';

/**
 * Loading state for the admin Stats dashboard. Mirrors the Overview tab
 * layout (header + period selector, three metric cards, traffic chart and
 * content distribution) so the skeleton-to-content swap does not jump.
 * Replaces the former full-screen spinner, which was the only admin page
 * without a structural skeleton.
 */
const AdminStatsSkeleton: React.FC = () => (
    <div className="page-reveal min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8">
            {/* Header: title + period select */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="space-y-3">
                    <Skeleton className="h-9 w-64 rounded-xl" />
                    <Skeleton className="h-4 w-96 max-w-full rounded-md" />
                </div>
                <Skeleton className="h-12 w-44 rounded-xl" />
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-panel-primary border border-border-medium rounded-3xl p-6 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-28 rounded-md" />
                            <Skeleton className="h-10 w-10 rounded-xl" />
                        </div>
                        <Skeleton className="h-9 w-32 rounded-xl" />
                        <Skeleton className="h-3 w-20 rounded-full" />
                    </div>
                ))}
            </div>

            {/* Traffic chart + content distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-panel-primary border border-border-medium rounded-3xl p-6 md:p-8">
                    <Skeleton className="h-5 w-48 rounded-lg mb-8" />
                    <div className="flex items-end gap-2 h-48">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                className="flex-1 rounded-t-lg"
                                style={{ height: `${30 + ((i * 37) % 60)}%` }}
                            />
                        ))}
                    </div>
                </div>
                <div className="bg-panel-primary border border-border-medium rounded-3xl p-6 md:p-8 space-y-5">
                    <Skeleton className="h-5 w-40 rounded-lg" />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-3 w-3 rounded-full" />
                            <Skeleton className="h-4 flex-1 rounded-md" />
                            <Skeleton className="h-4 w-10 rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default AdminStatsSkeleton;
