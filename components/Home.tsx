import React from 'react';
import { useNavigate } from 'react-router';
// import Hero from './Hero';
import AnimeRow from './AnimeRow';
import Banner from './Banner';
import HomeSkeleton from './skeletons/HomeSkeleton';
import { useHomeLogic } from '../hooks/useHomeLogic';
import { useLocale } from '../context/LocaleContext';
import { AppRoute } from '../types';
import SEO from './SEO';

const Home: React.FC = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const { state } = useHomeLogic();

  const showMore = (filter: string) => {
    navigate(`${AppRoute.Catalog}?selection=${filter}`);
  };

  if (state.error) {
    return <div className="w-full min-h-screen flex items-center justify-center text-red-500">{t('home.loadingError')}</div>
  }

  return (
    <>
      <SEO image={state.featured?.coverUrl} />
      
      {/* Temporarily disabled Hero section
      <Hero anime={state.featured} />
      */}
      
      {/* CHANGED: Increased top padding (pt-32) to match other pages and compensate for missing Hero */}
      <div className="relative z-10 bg-background-primary pb-20 pt-32 flex flex-col gap-10 md:gap-12 animate-fade-in">
        {/* Moved Banner to the top to act as a visual anchor since Hero is disabled */}
        <Banner items={state.banners} isLoading={state.isLoading} />
        <AnimeRow title={t('home.trendingNow')} items={state.trending} onShowMore={() => showMore('trending')} isLoading={state.isLoading} />
        <AnimeRow title={t('home.newReleases')} items={state.newReleases} onShowMore={() => showMore('new')} isLoading={state.isLoading} />
        
        <AnimeRow title={t('home.best')} items={[...state.trending].reverse()} onShowMore={() => showMore('best')} isLoading={state.isLoading} />
        <AnimeRow title={t('home.movies')} items={state.trending} onShowMore={() => showMore('movies')} isLoading={state.isLoading} />
      </div>
    </>
  );
};

export default Home;
