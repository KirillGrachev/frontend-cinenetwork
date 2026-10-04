import React from 'react';
import { useNavigate } from 'react-router';
import type { CollectionViewModel } from '../../types';
import AnimeImage from '../AnimeImage';
import { useLocale } from '../../context/LocaleContext';
import { AppRoute } from '../../types';

/** Polymorphic props definition */
type CollectionCardProps<E extends React.ElementType> = {
    collection: CollectionViewModel;
    index: number;
    as?: E;
} & React.ComponentPropsWithoutRef<E>;

const CollectionCard = <E extends React.ElementType = 'div'>({
    collection,
    index: _index,
    as,
    ...props
}: CollectionCardProps<E>) => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const { previews } = collection;
    const Component = as || 'div';

    if (previews.length < 3) return null;

    const handleCardClick = () => navigate(`${AppRoute.Collections}/${collection.id}`);

    const handleCuratorsClick = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
        navigate(`${AppRoute.Collections}/${collection.id}/curators`);
    };

    const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    };

    return (
        <Component
            onClick={handleCardClick}
            onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, handleCardClick)}
            role={as ? undefined : 'button'}
            tabIndex={as ? undefined : 0}
            aria-label={t('media.collections.viewDetails', { title: t(collection.title) })}
            // CHANGED: Removed 'group' from here to prevent curator hover from triggering card animation
            className="flex flex-col gap-3 cursor-pointer block"

            {...props}
        >
            {/* CHANGED: Added 'group' here so only hovering THIS div triggers the animations inside it */}
            <div className="group relative h-[280px] bg-panel-primary rounded-[32px]  overflow-hidden flex flex-col items-center pt-8 transition-colors duration-300 hover:bg-panel-secondary hover:border-border-medium">
                {/** Text Content */}
                <div className="text-center z-20 px-6 relative">
                    <h3 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-gray-100 transition-colors">
                        {t(collection.title)}
                    </h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full inline-block border border-white/5">
                        {t('collections.animeCount', { count: collection.count })}
                    </p>
                </div>

                {/** Tilted Images Container */}
                <div className="absolute bottom-0 w-full h-[180px] flex justify-center items-end pb-0 pointer-events-none">
                    {/** Left Image */}
                    <div className="absolute bottom-[-20px] left-1/2 w-32 h-44 rounded-xl overflow-hidden border-4 border-panel-primary shadow-xl z-10 transform -translate-x-[110%] rotate-[-10deg] opacity-80 transition-all duration-500 group-hover:rotate-[-15deg] group-hover:-translate-x-[115%] group-hover:bg-panel-secondary group-hover:border-panel-secondary">
                        <AnimeImage
                            src={previews[1]}
                            className="w-full h-full object-cover"
                            alt={t('collections.collectionPreview')}
                            iconSize="sm"
                        />
                    </div>

                    {/** Right Image */}
                    <div className="absolute bottom-[-20px] left-1/2 w-32 h-44 rounded-xl overflow-hidden border-4 border-panel-primary shadow-xl z-10 transform translate-x-[10%] rotate-[10deg] opacity-80 transition-all duration-500 group-hover:rotate-[15deg] group-hover:translate-x-[15%] group-hover:bg-panel-secondary group-hover:border-panel-secondary">
                        <AnimeImage
                            src={previews[2]}
                            className="w-full h-full object-cover"
                            alt={t('collections.collectionPreview')}
                            iconSize="sm"
                        />
                    </div>

                    {/** Center Image */}
                    <div className="absolute bottom-[-10px] left-1/2 w-36 h-48 rounded-2xl overflow-hidden border-4 border-panel-primary shadow-2xl z-20 transform -translate-x-1/2 transition-all duration-500 group-hover:translate-y-[-10px] group-hover:border-panel-secondary">
                        <AnimeImage
                            src={previews[0]}
                            className="w-full h-full object-cover"
                            alt={t('collections.collectionPreview')}
                            iconSize="sm"
                        />
                    </div>
                </div>
            </div>

            {/** Curators Avatar Stack - Clickable Row */}
            <div
                className="flex items-center justify-between px-2 mt-1 cursor-pointer group/curators"
                onClick={handleCuratorsClick}
                onKeyDown={(e) => handleKeyDown(e, () => handleCuratorsClick(e))}
                role="button"
                tabIndex={0}
                aria-label={t('common.ui.viewAllCurators')}
                title={t('common.ui.viewAllCurators')}
            >
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide group-hover/curators:text-gray-300 transition-colors">
                    {t('collections.curators')}
                </div>
                <div className="flex -space-x-2 group-hover/curators:scale-105 transition-transform">
                    {[1, 2, 3].map((_, i) => (
                        <div
                            key={i}
                            className="w-7 h-7 rounded-full bg-item-primary flex items-center justify-center border-2 border-background-primary text-gray-500"
                        >
                            <i className="fa-solid fa-user text-[10px]"></i>
                        </div>
                    ))}
                    <div className="w-7 h-7 rounded-full border-2 border-background-primary bg-panel-tertiary text-[9px] text-white flex items-center justify-center font-bold">
                        +5
                    </div>
                </div>
            </div>
        </Component>
    );
};

export default CollectionCard;
