import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '../ui/Button';
import { useLocale } from '../../context/LocaleContext';
import { useToast } from '../../context/ToastContext';
import { Collection, AppRoute, ToastType } from '../../types';

interface CollectionHeaderProps {
    collection: Collection;
    itemsCount: number;
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({ collection, itemsCount }) => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        showToast(
            !isBookmarked ? t('common.toasts.addedToFavorites') : t('common.toasts.removedFromFavorites'),
            !isBookmarked ? ToastType.Success : ToastType.Info
        );
    };

    return (
        <div className="flex flex-col md:flex-row items-end gap-8">
            <div className="flex-1">
                
                {/* Updated Metadata Header */}
                <div className="flex items-center gap-3 mb-5 animate-fade-in">
                    <div className="flex items-center gap-2 text-blue-400">
                        <i className="fa-solid fa-layer-group text-sm"></i>
                        <span className="text-sm font-bold uppercase tracking-widest">
                            {t('collections.collection')}
                        </span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                    <span className="text-gray-300 text-sm font-medium">
                        {t('collections.titlesCount', { count: itemsCount })}
                    </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl animate-fade-in stagger-1">
                    {t(collection.title)}
                </h1>
                
                <div className="flex items-center gap-4 animate-fade-in stagger-2">
                    <div 
                        className="flex -space-x-2 cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => navigate(`${AppRoute.Collections}/${collection.id}/curators`)}
                        title={t('collections.viewCuratorsList')}
                    >
                        {[1, 2].map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-item-primary flex items-center justify-center border-2 border-background-primary text-gray-500">
                                <i className="fa-solid fa-user text-[10px]"></i>
                            </div>
                        ))}
                    </div>
                    <span className="text-sm text-gray-400 font-medium">{t('collections.curatedByTeam', { teamName: t('info.team.name') })}</span>
                </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto animate-fade-in stagger-3">
                <Button variant="primary" size="lg" className="flex-1 md:flex-none" icon="fa-solid fa-play">
                    {t('hero.watch')}
                </Button>
                <Button 
                    variant="secondary" 
                    size="lg" 
                    className={`w-[210px] flex-none ${isBookmarked ? '!bg-white/10 !text-green-400 !border-green-500/30' : ''}`}
                    icon={isBookmarked ? "fa-solid fa-check fa-fw" : "fa-regular fa-bookmark fa-fw"}
                    onClick={handleBookmark}
                >
                    {isBookmarked ? t('common.ui.added') : t('hero.watchLater')}
                </Button>
            </div>
        </div>
    );
};

export default CollectionHeader;