import React, { useRef } from 'react';
import type { VirtuosoHandle } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import type { Anime } from '../../../types';
import { useLocale } from '../../../context/LocaleContext';
import AnimeCard from '../../AnimeCard';

interface AnimeRelatedProps {
    franchise?: Anime[];
    similar?: Anime[];
}

const HorizontalList: React.FC<{ items: Anime[] }> = ({ items }) => {
    const ref = useRef<VirtuosoHandle>(null);

    // Simple helper for manual scrolling if needed, though native scroll/touch is primary
    const scrollRight = () => ref.current?.scrollBy({ left: 300, behavior: 'smooth' });

    return (
        <div className="relative group">
            {/* Navigation Hint (Desktop only) */}
            {items.length > 4 && (
                <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-black shadow-2xl"
                >
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
            )}

            <Virtuoso
                ref={ref}
                horizontalDirection
                data={items}
                className="h-[320px] md:h-[500px] w-full no-scrollbar"
                itemContent={(index, item) => (
                    <div className="w-[140px] md:w-[260px] pr-4 md:pr-6 py-2 h-full">
                        <AnimeCard anime={item} index={index} />
                    </div>
                )}
            />
        </div>
    );
};

const AnimeRelated: React.FC<AnimeRelatedProps> = ({ franchise, similar }) => {
    const { t } = useLocale();

    return (
        <div className="page-reveal space-y-12 pb-12">
            {/* Franchise Section */}
            {franchise && franchise.length > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">
                            {t('media.anime.details.franchise')}
                        </h3>
                        <span className="text-2xl text-gray-500 font-bold">{franchise.length}</span>
                    </div>
                    <HorizontalList items={franchise} />
                </div>
            )}

            {/* Similar Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">
                        {t('media.anime.details.similar')}
                    </h3>
                    <span className="text-2xl text-gray-500 font-bold">{similar?.length || 0}</span>
                </div>
                {similar && similar.length > 0 ? (
                    <HorizontalList items={similar} />
                ) : (
                    <div className="py-20 text-center text-gray-500 border border-dashed border-white/5 rounded-3xl bg-white/5">
                        {t('search.noResults')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnimeRelated;
