import React from 'react';
import type { Anime } from '../../types';
import { SortDirection } from '../../types';
import { useLocale } from '../../context/LocaleContext';
import AnimeCard from '../AnimeCard';
import Skeleton from '../ui/Skeleton';
import Pagination from '../ui/Pagination';

interface ScheduleGridProps {
    isLoading: boolean;
    error: Error | null;
    items: Anime[];
    placeholdersCount: number;
    sortOrder: SortDirection;
    activeDay: string;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
    isLoading,
    error,
    items,
    placeholdersCount,
    sortOrder,
    activeDay,
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const { t } = useLocale();

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 min-h-[600px]">
                {Array.from({ length: placeholdersCount || 10 }).map((_, idx) => (
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
                {t('schedule.loadingError')}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="w-full py-20 text-center text-gray-500 border border-dashed border-white/5 rounded-3xl bg-[#111]/30 flex flex-col items-center justify-center ">
                <i className="fa-regular fa-calendar-xmark text-4xl mb-4 opacity-50"></i>
                <p>{t('schedule.noReleases')}</p>
            </div>
        );
    }

    return (
        <div className="min-h-[600px] flex flex-col">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-4">
                {items.map((anime, index) => (
                    <AnimeCard
                        key={`${activeDay}-${anime.id}-${sortOrder}`}
                        anime={anime}
                        index={index}

                        hideOverlay={false}
                        hideRating={true}
                        overlayPos="top-left"
                        overlaySlot={
                            // Updated to match Rating Badge style: Solid bg, rounded-xl, shadow-lg, no blur
                            <div className="bg-panel-primary border border-white/10 px-3 py-1.5 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white text-xs font-bold leading-none pt-[1px]">
                                    {t('schedule.episodeShort')} {12 + (index % 5)}
                                </span>
                            </div>
                        }
                        metaSlot={
                            <div className="flex items-center gap-3">
                                <span className="text-blue-400 font-bold text-xs bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 backdrop-blur-sm">
                                    {sortOrder === SortDirection.Desc
                                        ? `${18 + (index % 6)}:30`
                                        : `${10 + (index % 6)}:00`}
                                </span>
                                <span className="text-gray-300 text-xs font-medium opacity-80 truncate">
                                    {t(`genres.${anime.genres[0]}`)}
                                </span>
                            </div>
                        }
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    className="mt-12"
                />
            )}
        </div>
    );
};

export default ScheduleGrid;
