
import React from 'react';
import { useNavigate } from 'react-router';
import { CollectionViewModel } from '../../hooks/useCollectionsLogic';
import AnimeImage from '../AnimeImage';
import { useLocale } from '../../context/LocaleContext';
import { AppRoute } from '../../types';

interface FeaturedCollectionProps {
  collection: CollectionViewModel;
}

const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({ collection }) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  
  const handleCardClick = () => navigate(`${AppRoute.Collections}/${collection.id}`);

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
      }
  };

  return (
    <div className="mb-12 animate-fade-in z-0 relative">
        <div 
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={t('media.collections.viewDetails', { title: t(collection.title) })}
            className="group relative w-full h-[400px] md:h-[500px] rounded-[40px] overflow-hidden  cursor-pointer bg-panel-primary"
        >
            
            {/** Background Grid */}
            <div className="absolute inset-0 grid grid-cols-4 gap-0 opacity-60 group-hover:scale-105 transition-transform duration-700 ease-in-out">
                {collection.bgImages.map((src, i) => (
                    <div key={i} className="w-full h-full relative border-r border-black/10 last:border-0">
                        <AnimeImage src={src} alt={t('collections.collectionPreview')} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>

            {/** Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>

            {/** Hover Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-500 ease-in-out z-20">
                {/* Changed bg-black/30 backdrop-blur-md to bg-panel-primary for solid, clean look without lag */}
                <div className="w-20 h-20 rounded-full bg-panel-primary flex items-center justify-center border-2 border-border-medium text-white shadow-lg">
                    <i className="fa-solid fa-eye text-3xl"></i>
                </div>
            </div>

            {/** Content */}
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full z-20">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-xl">{t(collection.title)}</h2>
                <div className="flex items-center gap-4 text-gray-300 font-medium">
                    <span className="flex items-center gap-2">
                        {/* Adjusted icon alignment */}
                        <i className="fa-solid fa-film text-sm translate-y-[1px]"></i> 
                        {t('collections.titlesCount', { count: collection.count })}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                    <span className="text-sm opacity-80">{t('collections.updatedYesterday')}</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default FeaturedCollection;
