import React from 'react';
import type { AnimeWithViews } from '../../hooks/useTopChartsLogic';
import AnimeImage from '../AnimeImage';
import { TopMetric } from '../../types';
import { useLocale } from '../../context/LocaleContext';
import { formatCompactNumber } from '../../utils/i18n';

// Polymorphic props definition
type TopChartItemProps<E extends React.ElementType> = {
    anime: AnimeWithViews;
    rank: number;
    metric: TopMetric;
    as?: E;
} & React.ComponentPropsWithoutRef<E>;

const TopChartItem = <E extends React.ElementType = 'div'>({
    anime,
    rank,
    metric,
    as,
    ...props
}: TopChartItemProps<E>) => {
    const { t, locale } = useLocale();
    const Component = as || 'div';

    // Rank Styling Logic
    const getRankColor = (r: number) => {
        if (r === 1) return 'text-yellow-400';
        if (r === 2) return 'text-gray-300';
        if (r === 3) return 'text-orange-400';
        return 'text-gray-600';
    };

    const rankColor = getRankColor(rank);

    return (
        <Component
            role={as ? undefined : 'button'}
            tabIndex={as ? undefined : 0}
            aria-label={t('media.anime.viewDetails', { title: t(anime.title) })}
            className="group relative bg-panel-primary border border-border-medium hover:border-border-medium rounded-2xl p-4 flex items-center gap-6 transition-all duration-300 hover:bg-panel-secondary cursor-pointer"
            {...props}
        >
            {/* Rank Number */}
            <div
                className={`text-4xl md:text-5xl font-black w-16 text-center flex-shrink-0 ${rankColor} opacity-80 group-hover:opacity-100 transition-opacity`}
            >
                {rank}
            </div>

            {/* Thumbnail */}
            <div className="relative w-[60px] h-[85px] md:w-[80px] md:h-[110px] rounded-lg overflow-hidden flex-shrink-0 bg-panel-tertiary shadow-lg">
                <AnimeImage
                    src={anime.thumbnailUrl}
                    alt={t(anime.title)}
                    className="w-full h-full object-cover"
                    iconSize="sm"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-xl font-bold text-white mb-2 truncate pr-4 group-hover:text-blue-400 transition-colors">
                    {t(anime.title)}
                </h3>
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-500">
                    <span className="font-medium text-white">{anime.year}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <span className="truncate max-w-[150px]">{t(`genres.${anime.genres[0]}`)}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600 hidden md:block"></span>
                    <span className="hidden md:block">{anime.studio}</span>
                </div>
            </div>

            {/* Stats (Right side) */}
            <div className="hidden md:flex flex-col items-end gap-2 pl-4">
                {metric === TopMetric.Rating ? (
                    // Rating prioritized display
                    <>
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/5">
                            <span className="font-bold text-white text-lg">{anime.rating}</span>
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                            {formatCompactNumber(anime.views, locale)} {t('topCharts.views')}
                        </div>
                    </>
                ) : (
                    // Views prioritized display
                    <>
                        {/* CHANGED: rounded-lg -> rounded-full */}
                        <div className="text-sm font-bold text-white bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                            {formatCompactNumber(anime.views, locale)} {t('topCharts.views')}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold">
                            <span className="text-gray-400">{t('topCharts.ratingLabel')}:</span>{' '}
                            {anime.rating}
                        </div>
                    </>
                )}
            </div>
        </Component>
    );
};

export default TopChartItem;
