import React from 'react';
import type { CollectionViewModel } from '../../types';
import CollectionCard from './CollectionCard';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import { useLocale } from '../../context/LocaleContext';
interface CollectionsGridProps {
    isLoading: boolean;
    error: Error | null;
    items: CollectionViewModel[];
    hasResults: boolean;
    onReset: () => void;
}
const CollectionsGrid: React.FC<CollectionsGridProps> = ({
    isLoading,
    error,
    items,
    hasResults,
    onReset,
}) => {
    const { t } = useLocale();
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {Array.from({
                    length: 6,
                }).map((_, idx) => (
                    <div key={idx} className="flex flex-col gap-3 w-full">
                        <div className="h-[280px] w-full">
                            <Skeleton className="w-full h-full rounded-[32px]" />
                        </div>
                        <div className="flex items-center justify-between px-2 mt-1">
                            <Skeleton className="w-20 h-4 rounded" />
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-7 h-7 rounded-full border-2 border-background-primary overflow-hidden"
                                    >
                                        <Skeleton className="w-full h-full rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex justify-center items-center h-96 text-red-500">
                {t('collections.loadingError')}
            </div>
        );
    }
    if (!hasResults) {
        return (
            <EmptyState
                icon="fa-solid fa-layer-group"
                title={t('search.noResults')}
                description={t('search.tryDifferentQuery')}
                actionLabel={t('catalog.resetFilters')}
                onAction={onReset}
            />
        );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {items.map((item, index) => {
                const content = <CollectionCard collection={items[index]} index={index} />;
                return (
                    <div key={item.id} className="w-full">
                        {content}
                    </div>
                );
            })}
        </div>
    );
};
export default CollectionsGrid;
