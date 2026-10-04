import React, { useState } from 'react';
import type { AnimeDetails } from '../../../types';
import { useLocale } from '../../../context/LocaleContext';
import AnimeImage from '../../AnimeImage';
import AnimeReviews from '../AnimeReviews';
import { useNavigate } from 'react-router';

interface AnimeOverviewProps {
    anime: AnimeDetails;
    screenshots: string[];
    setActiveTab: (tab: string) => void;
    openViewer: (index: number) => void;
    formatDuration: (val?: string) => string;
    formatSource: (src?: string) => string;
}

const AnimeOverview: React.FC<AnimeOverviewProps> = ({
    anime,
    screenshots,
    setActiveTab,
    openViewer,
    formatDuration,
    formatSource,
}) => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    return (
        <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left Column: Description & Metadata (8/12) */}
                <div className="lg:col-span-8 space-y-8">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">
                            {t('media.anime.details.synopsis')}
                        </h3>
                        <div
                            className={`relative ${!isDescriptionExpanded ? 'line-clamp-4' : ''} text-gray-300 leading-relaxed text-base transition-all`}
                        >
                            {t(anime.description)}
                        </div>
                        {t(anime.description).length > 250 && (
                            <button
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                className="text-blue-400 text-xs font-bold uppercase tracking-wider mt-2 hover:text-blue-300 transition-colors"
                            >
                                {isDescriptionExpanded
                                    ? t('media.anime.details.readLess')
                                    : t('media.anime.details.readMore')}
                            </button>
                        )}
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-8">
                        <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                {t('media.anime.details.type')}
                            </span>
                            <span className="text-white font-medium">
                                {t(`admin.content.types.${anime.type?.toLowerCase() || 'tv'}`)}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                {t('media.anime.details.status')}
                            </span>
                            <span className="text-white font-medium capitalize">
                                {t(`media.anime.details.statuses.${anime.status}`)}
                            </span>
                        </div>
                        {/* Interactive Episode Count -> Switches to Episodes Tab */}
                        <div
                            className="cursor-pointer w-fit"
                            onClick={() => setActiveTab('episodes')}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setActiveTab('episodes');
                                }
                            }}
                        >
                            <span className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                {t('media.anime.details.episodesCount')}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-medium transition-colors border-b border-transparent pb-0.5">
                                    {anime.episodesCount}
                                </span>
                            </div>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                {t('media.anime.details.duration')}
                            </span>
                            <span className="text-white font-medium">
                                {formatDuration(anime.duration)}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                {t('media.anime.details.source')}
                            </span>
                            <span className="text-white font-medium">
                                {formatSource(anime.source)}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                {t('media.anime.details.studio')}
                            </span>
                            {anime.studio ? (
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/studio/${encodeURIComponent(anime.studio || '')}`,
                                        )
                                    }
                                    className="text-white font-medium hover:text-blue-400 hover:border-b hover:border-blue-400 transition-colors border-b border-transparent pb-0.5"
                                    title={t('media.catalog.studio')}
                                >
                                    {anime.studio}
                                </button>
                            ) : (
                                <span className="text-gray-500">—</span>
                            )}
                        </div>
                        <div className="col-span-2 sm:col-span-3">
                            <span className="block text-xs font-bold text-gray-500 uppercase mb-2">
                                {t('media.catalog.genres')}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {anime.genres.map((g) => (
                                    <span
                                        key={g}
                                        className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/5 hover:bg-white/10 transition-colors cursor-default"
                                    >
                                        {t(`genres.${g}`)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Screenshots Preview (4/12) */}
                <div className="lg:col-span-4 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">
                            {t('media.anime.details.photos')}
                        </h3>
                    </div>

                    {/* Screenshots Grid - Fixed 4 items */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        {screenshots.slice(0, 4).map((src, idx) => (
                            <div
                                key={idx}
                                onClick={() => openViewer(idx)}
                                className="relative aspect-video rounded-lg overflow-hidden bg-panel-secondary cursor-pointer group"
                            >
                                <AnimeImage
                                    src={src}
                                    alt="Screenshot"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    placeholderClassName="w-8 h-8 rounded-xl"
                                    placeholderIconClassName="text-xs"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-2xl bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100 border border-white/10">
                                        <i className="fa-solid fa-expand text-xs"></i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 'Show More' Button -> Redirects to Photos tab */}
                    {screenshots.length > 4 && (
                        <button
                            onClick={() => setActiveTab('photos')}
                            className="w-full py-3 rounded-xl border border-dashed border-white/10 text-xs font-bold text-gray-500 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all uppercase tracking-wide flex items-center justify-center gap-2"
                        >
                            <span>
                                {t('common.ui.showMore')} ({screenshots.length - 4})
                            </span>
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <div className="lg:col-span-8">
                    <AnimeReviews animeId={anime.id} reviews={anime.reviews || []} />
                </div>
            </div>
        </div>
    );
};

export default AnimeOverview;
