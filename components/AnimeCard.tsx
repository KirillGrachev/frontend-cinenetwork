import React from 'react';
import { Link } from 'react-router';
import type { Anime } from '../types';
import { FavoriteStatus, ToastType } from '../types';
import AnimePoster from './AnimePoster';
import BookmarkButton from './ui/BookmarkButton';
import { useLocale } from '../context/LocaleContext';
import { useToast } from '../context/ToastContext';
import { useAnimeStore } from '../store/animeStore';

/** Polymorphic props definition */
type AnimeCardProps<E extends React.ElementType> = {
    anime: Anime;
    index?: number;
    className?: string;
    hideOverlay?: boolean;
    hideRating?: boolean;
    showBookmark?: boolean;
    overlaySlot?: React.ReactNode;
    overlayPos?: 'top-left' | 'top-right';
    metaSlot?: React.ReactNode;
    as?: E;
} & React.ComponentPropsWithoutRef<E>;

const AnimeCard = <E extends React.ElementType = 'div'>({
    anime,
    index: _index = 0,
    className = '',
    hideOverlay = false,
    hideRating = false,
    showBookmark = true,
    overlaySlot,
    overlayPos = 'top-right',
    metaSlot,
    as,
    ...props
}: AnimeCardProps<E>) => {
    const { t } = useLocale();
    const { showToast } = useToast();

    // Use Global Store
    const favorites = useAnimeStore((state) => state.favorites);
    const toggleFavorite = useAnimeStore((state) => state.toggleFavorite);

    const isBookmarked = !!favorites[anime.id];

    /**
     * Polymorphic root: renders as the provided `as` element, or as a router
     * `Link` to the anime page by default. `Component` is typed as
     * `React.ElementType` — with a generic union TypeScript cannot correlate
     * the props spread with the element type, and the previous attempt
     * produced an unassignable `LinkProps | ComponentProps<E>` union.
     */
    const Component: React.ElementType = as ?? Link;
    const componentProps = as ? props : { to: `/anime/${anime.id}`, ...props };

    const handleBookmarkClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); /** Prevent opening the anime details */

        toggleFavorite(anime, FavoriteStatus.Planned);

        showToast(
            !isBookmarked
                ? t('common.toasts.addedToFavorites')
                : t('common.toasts.removedFromFavorites'),
            !isBookmarked ? ToastType.Success : ToastType.Info,
        );
    };

    const overlayPosClass = overlayPos === 'top-left' ? 'top-3 left-3' : 'top-3 right-3';

    return (
        <Component
            className={`group cursor-pointer relative block aspect-[2/3] w-full ${className}`}
            aria-label={t('media.anime.viewDetails', { title: t(anime.title) })}
            {...componentProps}
        >
            <div className="w-full h-full rounded-2xl overflow-hidden relative isolate bg-gray-900 transform-gpu [backface-visibility:hidden] [transform-style:preserve-3d] shadow-sm border border-white/5">
                {/** Base Poster with optional Rating Badge */}
                <AnimePoster
                    src={anime.thumbnailUrl}
                    alt={t(anime.title)}
                    rating={anime.rating}
                    hideOverlay={hideOverlay}
                    showRating={!hideRating}
                    className="w-full h-full rounded-2xl"
                >
                    {/** Bookmark Button - Top Right Curtain Style */}
                    {showBookmark && !hideOverlay && (
                        <div
                            className={`absolute top-0 right-4 z-40 transition-all duration-300 ease-out transform ${
                                isBookmarked
                                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                                    : '-translate-y-full opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                            }`}
                        >
                            <BookmarkButton
                                isBookmarked={isBookmarked}
                                onClick={handleBookmarkClick}
                            />
                        </div>
                    )}

                    {/** Slot for additional badges (like Favorites status or Episodes) */}
                    {!hideOverlay && overlaySlot && (
                        <div className={`absolute ${overlayPosClass} z-30 pointer-events-none`}>
                            {overlaySlot}
                        </div>
                    )}
                </AnimePoster>

                {/** Overlays Layer - Positioned absolutely on top of the poster */}
                {!hideOverlay && (
                    <>
                        {/** Bottom Gradient & Text */}
                        <div
                            className="absolute inset-x-0 bottom-0 h-2/3 z-10 pointer-events-none transition-opacity duration-300"
                            style={{
                                background:
                                    'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)',
                            }}
                        ></div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transition-transform duration-300 ease-out pointer-events-none">
                            <div className="text-white font-bold text-lg leading-tight line-clamp-2 mb-1.5 drop-shadow-md">
                                {t(anime.title)}
                            </div>

                            {metaSlot ? (
                                metaSlot
                            ) : (
                                <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                                    <span>{anime.year}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                                    <span className="truncate">
                                        {t(`genres.${anime.genres[0]}`)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Component>
    );
};

export default AnimeCard;
