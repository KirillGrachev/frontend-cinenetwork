import React from 'react';
import { useNavigate } from 'react-router';
import type { Collection } from '../../types';
import { AppRoute } from '../../types';
import { useLocale } from '../../context/LocaleContext';

interface SearchCollectionCardProps {
    collection: Collection;
}

const SearchCollectionCard: React.FC<SearchCollectionCardProps> = ({ collection }) => {
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
        <div
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={t('media.collections.viewDetails', { title: t(collection.title) })}
            className="bg-panel-primary border border-border-medium rounded-2xl p-6 transition-all hover:bg-item-primary hover:border-border-medium cursor-pointer group"
        >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                <i className="fa-solid fa-layer-group text-gray-400 group-hover:text-white"></i>
            </div>
            <h3 className="font-bold text-white text-lg mb-1">{t(collection.title)}</h3>
            <p className="text-sm text-gray-500 font-medium">
                {t('collections.animeCount', { count: collection.count })}
            </p>
        </div>
    );
};

export default SearchCollectionCard;
