import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useLocale } from '../context/LocaleContext';
import { useStudioPageLogic } from '../hooks/useStudioPageLogic';
import LoadingSpinner from './LoadingSpinner';
import Button from './ui/Button';
import AnimeCard from './AnimeCard';
import NotFound from './NotFound';
import SEO from './SEO';
import StudioPageSkeleton from './skeletons/StudioPageSkeleton';

const StudioPage: React.FC = () => {
  const {
    name
  } = useParams<{
    name: string;
  }>();
  const navigate = useNavigate();
  const {
    t
  } = useLocale();
  const studioName = decodeURIComponent(name || '');
  const {
    state
  } = useStudioPageLogic(studioName);
  const {
    animeList,
    isLoading,
    error
  } = state;
  if (isLoading) {
    return <StudioPageSkeleton />;
  }
  if (error || !studioName) {
    return <NotFound />;
  }
  return <div className="min-h-screen pt-24 pb-20 relative bg-background-primary">
        <SEO title={studioName} description={`${studioName} - ${t('media.catalog.studio')}`} />
        
        {/* Header Section */}
        <div className="relative mb-12">
            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="mb-8 animate-fade-in">
                    <Button variant="ghost" size="md" icon="fa-solid fa-arrow-left" onClick={() => navigate(-1)} className="pl-0 hover:!bg-transparent hover:text-white">
                        {t('common.ui.back')}
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row items-end gap-8 animate-fade-in stagger-1">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 text-blue-400">
                                <i className="fa-solid fa-building text-sm"></i>
                                <span className="text-sm font-bold uppercase tracking-widest">
                                    {t('media.catalog.studio')}
                                </span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                            {studioName}
                        </h1>
                        
                        <div className="flex items-center gap-4 text-gray-400">
                            <span className="text-base font-medium">
                                {animeList.length} {t('common.ui.titles').toLowerCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Content Grid */}
        <div className="container mx-auto px-4 md:px-8 min-h-[500px]">
            {animeList.length === 0 ? <div className="text-center py-20 text-gray-500 animate-fade-in">
                    {t('search.noResults')}
                </div> : <div className="animate-fade-in stagger-2">
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
export default StudioPage;