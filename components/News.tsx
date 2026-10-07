import React from 'react';
import { useNavigate } from 'react-router';
import { getNewsPageConfig } from '../constants';
import { useNewsLogic } from '../hooks/useNewsLogic';
import NewsCard from './NewsCard';
// import LoadingSpinner from './LoadingSpinner'; // Removed in favor of inline skeleton
import PageHeader from './ui/PageHeader';
import { useLocale } from '../context/LocaleContext';
import { AppRoute } from '../types';
import SEO from './SEO';
import NewsSkeleton from './skeletons/NewsSkeleton';
const News: React.FC = () => {
  const {
    t
  } = useLocale();
  const navigate = useNavigate();
  const NEWS_PAGE_CONFIG = getNewsPageConfig(t);
  const {
    state
  } = useNewsLogic();
  const onOpenPost = (id: number) => {
    navigate(`${AppRoute.News}/${id}`);
  };
  if (state.isLoading) {
    return <NewsSkeleton />;
  }
  if (state.error) {
    return <div className="w-full min-h-screen flex items-center justify-center text-red-500">{t('news.loadingError')}</div>;
  }
  return <div className="min-h-screen pt-32 pb-20">
      <SEO title={NEWS_PAGE_CONFIG.title} description={NEWS_PAGE_CONFIG.description} />
      <div className="container mx-auto px-4 md:px-8 h-full flex flex-col">
        
        <PageHeader title={NEWS_PAGE_CONFIG.title} description={NEWS_PAGE_CONFIG.description} />

        {state.featuredItem && (
          <div className="mb-6">
            <NewsCard 
              item={state.featuredItem} 
              className="h-[350px]"
              onClick={onOpenPost} 
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
    {state.gridItems.map((item) => {
          const content = <NewsCard item={item} className="h-full min-h-[280px]" onClick={onOpenPost} />;
          return <div key={item.id} className="w-full">{content}</div>;
        })}
</div>
      </div>
    </div>;
};
export default News;