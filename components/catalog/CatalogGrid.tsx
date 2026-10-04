import React from 'react';
import type { Anime } from '../../types';
import { useLocale } from '../../context/LocaleContext';
import AnimeCard from '../AnimeCard';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import Pagination from '../ui/Pagination';

interface CatalogGridProps {
    isLoading: boolean;
    error: Error | null;
    items: Anime[];
    placeholdersCount: number;
    currentPage: number;
    totalPages: number;
    hasResults: boolean;
    onPageChange: (page: number) => void;
    onReset: () => void;
}

const CatalogGrid: React.FC<CatalogGridProps> = ({
    isLoading,
    error,
    items,
    // ADDED: Destructured placeholdersCount for use in skeleton rendering
    placeholdersCount,
    currentPage,
    totalPages,
    hasResults,
    onPageChange,
    onReset,
}) => {
    const { t } = useLocale();

    const handlePageChange = (page: number) => {
        onPageChange(page);
        // Smooth scroll back to filters when page changes for better UX
        window.scrollTo({ top: 200, behavior: 'smooth' });
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 min-h-[400px]">
                {/* CHANGED: Use placeholdersCount prop for dynamic skeleton count */}
                {Array.from({ length: placeholdersCount || 15 }).map((_, idx) => (
                    <div key={idx} className="aspect-[2/3] w-full">
                        <Skeleton className="w-full h-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-96 text-red-500">
                {t('catalog.loadingError')}
            </div>
        );
    }

    if (!hasResults) {
        return (
            <EmptyState
                icon="fa-solid fa-filter-circle-xmark"
                title={t('search.noResults')}
                description={t('search.tryDifferentQuery')}
                actionLabel={t('catalog.resetFilters')}
                onAction={onReset}
            />
        );
    }

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 min-h-[400px]">
                {items.map((anime, index) => (
                    <AnimeCard key={anime.id} anime={anime} index={index} />
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="mt-12"
                />
            )}
        </div>
    );
};

export default CatalogGrid;
