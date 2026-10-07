
import React, { useRef, useState, useEffect } from 'react';
import { Anime } from '../types';
import AnimeCard from './AnimeCard';
import { useLocale } from '../context/LocaleContext';

interface AnimeRowProps {
  title: string;
  items: Anime[];
  onShowMore?: () => void;
  isLoading?: boolean;
}

const AnimeRow: React.FC<AnimeRowProps> = ({ title, items, onShowMore, isLoading = false }) => {
  const { t } = useLocale();
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Scroll detection logic
  const handleScroll = () => {
      if (rowRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
          setShowLeftArrow(scrollLeft > 0);
          // Allow a small buffer (10px) for float calculation errors
          setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
      }
  };

  useEffect(() => {
      const el = rowRef.current;
      if (el) {
          handleScroll(); // Check initial state
          el.addEventListener('scroll', handleScroll);
          window.addEventListener('resize', handleScroll);
          return () => {
              el.removeEventListener('scroll', handleScroll);
              window.removeEventListener('resize', handleScroll);
          };
      }
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
      if (rowRef.current) {
          const { clientWidth } = rowRef.current;
          const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
          rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
  };

  return (
    <div className={`relative group/row ${isLoading ? 'animate-pulse' : 'animate-fade-in'} last:mb-0`}>
      {/* Container ensures Title and Show More align with global grid */}
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-5">
          <div className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none" role="heading" aria-level={2}>
            {isLoading ? <div className="h-7 md:h-8 w-44 md:w-56 bg-white/15 rounded-xl"></div> : title} 
          </div>
          {onShowMore && (
            <button 
                onClick={onShowMore}
                disabled={isLoading}
                className="text-sm font-bold text-gray-500 hover:text-white transition-colors duration-300 uppercase tracking-wide flex items-center gap-2 leading-none"
            >
                {isLoading ? <div className="h-5 w-28 md:w-36 bg-white/10 rounded-lg"></div> : <>{t('home.showMore')} <i className="fa-solid fa-chevron-right text-xs"></i></>}
            </button>
          )}
        </div>
        
        {/* Row Container */}
        <div className="relative">
            
            {/* Scroll Buttons */}
            {!isLoading && showLeftArrow && (
                <div className="absolute left-0 top-0 bottom-4 z-30 hidden md:flex items-center pointer-events-none opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={() => scroll('left')}
                        aria-label={t('common.ui.scrollLeft')}
                        className="pointer-events-auto w-14 h-14 rounded-2xl bg-panel-primary border border-white/10 text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:bg-panel-secondary hover:border-white/20 -ml-7"
                    >
                        <i className="fa-solid fa-chevron-left text-base"></i>
                    </button>
                </div>
            )}
            
            {!isLoading && showRightArrow && items.length > 0 && (
                <div className="absolute right-0 top-0 bottom-4 z-30 hidden md:flex items-center pointer-events-none opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={() => scroll('right')}
                        aria-label={t('common.ui.scrollRight')}
                        className="pointer-events-auto w-14 h-14 rounded-2xl bg-panel-primary border border-white/10 text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:bg-panel-secondary hover:border-white/20 -mr-7"
                    >
                        <i className="fa-solid fa-chevron-right text-base"></i>
                    </button>
                </div>
            )}

            {/* Native Scrollable List */}
            {isLoading ? (
                <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 no-scrollbar">
                    {Array.from({ length: 6 }).map((_, j) => (
                        <div key={j} className="w-[140px] md:w-[240px] flex-shrink-0 aspect-[2/3] bg-panel-primary rounded-2xl border border-white/10 relative overflow-hidden shadow-sm">
                            <div className="absolute top-3 left-3 w-[42px] h-[28px] bg-white/10 rounded-xl"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                                <div className="h-5 w-4/5 bg-white/15 rounded-md"></div>
                                <div className="h-4 w-1/2 bg-white/10 rounded-md"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : items.length > 0 ? (
                <div 
                    ref={rowRef}
                    className="flex overflow-x-auto gap-4 md:gap-6 pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
                >
                    {items.map((anime, index) => (
                        <div key={anime.id} className="w-[140px] md:w-[240px] flex-shrink-0 snap-start">
                            <AnimeCard anime={anime} index={index} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-40 flex items-center justify-center text-gray-500 text-sm border border-dashed border-white/10 rounded-2xl">
                    {t('search.noResults')}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AnimeRow;
