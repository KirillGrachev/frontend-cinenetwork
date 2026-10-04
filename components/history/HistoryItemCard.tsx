import React from 'react';
import { useNavigate } from 'react-router';
import type { HistoryItem } from '../../types';
import { useLocale } from '../../context/LocaleContext';
import AnimeImage from '../AnimeImage';

interface HistoryItemCardProps {
    item: HistoryItem;
    onRemove: (id: string) => void;
}

const HistoryItemCard: React.FC<HistoryItemCardProps> = ({ item, onRemove }) => {
    const { t } = useLocale();
    const navigate = useNavigate();

    const handleCardClick = () => {
        // Navigate to Watch page with specific episode query param
        navigate(`/watch/${item.anime.id}?ep=${item.episode}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
        }
    };

    return (
        <div
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={t('history.continueWatching', { title: t(item.anime.title) })}
            className="group relative bg-panel-primary border border-border-medium hover:border-border-medium rounded-2xl overflow-hidden transition-all duration-300 hover:bg-panel-secondary flex flex-row h-28 md:h-32 cursor-pointer"
        >
            {/* Thumbnail Section */}
            <div className="relative w-24 md:w-48 flex-shrink-0 bg-black overflow-hidden">
                <AnimeImage
                    src={item.anime.coverUrl}
                    alt={t(item.anime.title)}
                    /* Removed group-hover:scale-95 to prevent black bars */
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-all duration-300"
                    iconSize="sm"
                />

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    {/* CHANGED: rounded-full -> rounded-xl */}
                    <div className="w-10 h-10 rounded-xl bg-panel-secondary/90 backdrop-blur-sm flex items-center justify-center  text-white transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                        <i className="fa-solid fa-play text-xs ml-0.5"></i>
                    </div>
                </div>

                {/* Progress Bar - Blue */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
                    <div
                        className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                        style={{ width: `${item.progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 py-3 px-4 flex flex-col justify-between relative min-w-0">
                <div className="pr-8">
                    {/* Title */}
                    <h3
                        className="font-bold text-white text-sm leading-tight line-clamp-2 mb-2 group-hover:text-gray-200 transition-colors break-words"
                        title={t(item.anime.title)}
                    >
                        {t(item.anime.title)}
                    </h3>

                    {/* Meta: Season & Episode */}
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 flex-wrap">
                        <span className="text-gray-300 bg-white/5 px-3 py-0.5 rounded-full border border-white/5 whitespace-nowrap">
                            {t('media.catalog.seasonLabel', { number: 1 })}
                        </span>
                        <span className="text-gray-300 bg-white/5 px-3 py-0.5 rounded-full border border-white/5 whitespace-nowrap">
                            {t('history.episode')} {item.episode}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide group-hover:text-gray-400 transition-colors">
                        {t('history.timeLeft', { mins: Math.round((100 - item.progress) * 0.24) })}
                    </span>
                </div>

                {/* Remove Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onRemove(item.id);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-xl flex items-center justify-center text-gray-600 hover:text-white bg-transparent hover:bg-white/10 transition-all z-20"
                    aria-label={t('history.removeModal.ariaLabelRemove')}
                >
                    <i className="fa-solid fa-xmark text-xs"></i>
                </button>
            </div>
        </div>
    );
};

export default HistoryItemCard;
