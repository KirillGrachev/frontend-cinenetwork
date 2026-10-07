import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useLocale } from '../../context/LocaleContext';
import { useCollectionDetailLogic } from '../../hooks/useCollectionDetailLogic';
import LoadingSpinner from '../LoadingSpinner';
import Button from '../ui/Button';
import AnimeCard from '../AnimeCard';
import CollectionHeader from './CollectionHeader';
import { AppRoute } from '../../types';
import SEO from '../SEO';
const CollectionDetail: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    t
  } = useLocale();
  const collectionId = Number(id);
  const {
    state
  } = useCollectionDetailLogic(collectionId);
  const {
    collection,
    animeList,
    isLoading,
    error
  } = state;
  if (isLoading) {
    return <div className="w-full min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }
  if (error || !collection) {
    return <div className="min-h-screen flex flex-col items-center justify-center pt-32 text-center px-4">
            <h2 className="text-2xl font-bold text-white mb-2">{t('collections.notFound')}</h2>
            <Button onClick={() => navigate(AppRoute.Collections)} variant="secondary" className="mt-4">{t('collections.backToAll')}</Button>
        </div>;
  }
  return <div className="min-h-screen pt-24 pb-20">
        <SEO title={t(collection.title)} description={t('collections.description')} image={collection.image} />
        
        {/* Header Section */}
        <div className="relative mb-12">
            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="mb-8 animate-fade-in">
                    <Button variant="ghost" size="md" icon="fa-solid fa-arrow-left" onClick={() => navigate(AppRoute.Collections)} className="pl-0 hover:!bg-transparent hover:text-white">
                        {t('collections.backToAll')}
                    </Button>
                </div>

                <CollectionHeader collection={collection} itemsCount={animeList.length} />
            </div>
        </div>

        {/* Content Grid */}
        <div className="container mx-auto px-4 md:px-8 min-h-[500px]">
            {animeList.length === 0 ? <div className="text-center py-20 text-gray-500 animate-fade-in">
                    {t('collections.emptyCollection')}
                </div> : <div className="animate-fade-in stagger-1">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-20">
    {animeList.map((item, index) => {
            const content = <AnimeCard anime={animeList[index]} index={index} />;
            return <div key={item.id} className="w-full">{content}</div>;
          })}
</div>
                </div>}
        </div>
    </div>;
};
export default CollectionDetail;