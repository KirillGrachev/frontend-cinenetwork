import React from 'react';
import { useNavigate } from 'react-router';
import PageHeader from './ui/PageHeader';
import AnimeCard from './AnimeCard';
import SearchCollectionCard from './search/SearchCollectionCard';
import LoadingSpinner from './LoadingSpinner';
import Button from './ui/Button';
import { useLocale } from '../context/LocaleContext';
import { useFavoritesLogic, AnimeWithStatus } from '../hooks/useFavoritesLogic';
import { FavoriteStatus, FILTER_ALL, AppRoute, FavoriteTab, Collection } from '../types';
import FavoritesSkeleton from './skeletons/FavoritesSkeleton';
const Favorites: React.FC = () => {
  const {
    t
  } = useLocale();
  const navigate = useNavigate();
  const {
    state,
    actions
  } = useFavoritesLogic();
  const {
    items,
    isLoading,
    error,
    activeCategory,
    activeTab
  } = state;
  const categories: {
    id: typeof FILTER_ALL | FavoriteStatus;
    label: string;
    icon: string;
  }[] = [{
    id: FILTER_ALL,
    label: t('favorites.tabs.all'),
    icon: 'fa-solid fa-layer-group'
  }, {
    id: FavoriteStatus.Watching,
    label: t('favorites.tabs.watching'),
    icon: 'fa-solid fa-play'
  }, {
    id: FavoriteStatus.Planned,
    label: t('favorites.tabs.planned'),
    icon: 'fa-solid fa-bookmark'
  }, {
    id: FavoriteStatus.Completed,
    label: t('favorites.tabs.completed'),
    icon: 'fa-solid fa-check'
  }, {
    id: FavoriteStatus.Paused,
    label: t('favorites.tabs.paused'),
    icon: 'fa-solid fa-pause'
  }, {
    id: FavoriteStatus.Dropped,
    label: t('favorites.tabs.dropped'),
    icon: 'fa-solid fa-trash'
  }];
  const tabs: {
    id: FavoriteTab;
    label: string;
    icon: string;
  }[] = [{
    id: FavoriteTab.Anime,
    label: t('navbar.searchCategoryLabels.anime'),
    icon: 'fa-solid fa-film'
  }, {
    id: FavoriteTab.Collections,
    label: t('navbar.searchCategoryLabels.collections'),
    icon: 'fa-solid fa-layer-group'
  }];
  const currentCategory = categories.find(c => c.id === activeCategory) || categories[0];
  const handleCycleCategory = () => {
    const currentIndex = categories.findIndex(c => c.id === activeCategory);
    const nextIndex = (currentIndex + 1) % categories.length;
    actions.setActiveCategory(categories[nextIndex].id);
  };

  // Helper to get color for the compact badge based on status
  const getStatusColor = (status: FavoriteStatus) => {
    switch (status) {
      case FavoriteStatus.Watching:
        return 'text-blue-400';
      case FavoriteStatus.Completed:
        return 'text-green-400';
      case FavoriteStatus.Planned:
        return 'text-gray-300';
      case FavoriteStatus.Dropped:
        return 'text-red-400';
      case FavoriteStatus.Paused:
        return 'text-orange-400';
      default:
        return 'text-white';
    }
  };
  const getStatusIcon = (status: FavoriteStatus) => {
    switch (status) {
      case FavoriteStatus.Watching:
        return 'fa-play';
      case FavoriteStatus.Completed:
        return 'fa-check';
      case FavoriteStatus.Planned:
        return 'fa-bookmark';
      case FavoriteStatus.Dropped:
        return 'fa-trash';
      case FavoriteStatus.Paused:
        return 'fa-pause';
      default:
        return 'fa-circle';
    }
  };
  if (isLoading) {
    return <FavoritesSkeleton />;
  }
  if (error) {
    return <div className="w-full min-h-screen flex items-center justify-center text-red-500">{t('home.loadingError')}</div>;
  }
  return <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8 h-full flex flex-col">
        
        <PageHeader title={t('favorites.title')} description={t('favorites.description')} />

        {/* Controls Container */}
        <div className="flex flex-col md:flex-row items-center justify-center mb-10 animate-fade-in stagger-1 z-20 gap-3">
            
            {/* Centered Tabs (Anime / Collections) */}
            <div className="bg-panel-primary p-1 rounded-full  inline-flex shadow-lg h-14 items-center">
                {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return <button key={tab.id} onClick={() => actions.setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 h-12 rounded-full text-sm font-bold transition-all duration-300 relative z-10 ${isActive ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                            <i className={`${tab.icon} ${isActive ? 'text-black' : 'text-gray-500'}`}></i>
                            {tab.label}
                        </button>;
          })}
            </div>

            {/* Cycling Filter Button */}
            {activeTab === FavoriteTab.Anime && <Button variant="black" className="!h-14 rounded-full font-medium min-w-[200px] group transition-all !px-6  bg-panel-primary" onClick={handleCycleCategory}>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <i className={`${currentCategory.icon} text-gray-400 group-hover:text-black transition-colors`}></i>
                            <span className="text-gray-300 group-hover:text-black transition-colors">{currentCategory.label}</span>
                        </div>
                        <div className="bg-white/10 rounded-full w-6 h-6 flex items-center justify-center ml-3 group-hover:bg-black/10 transition-colors">
                            <i className="fa-solid fa-rotate text-[10px] text-gray-400 group-hover:text-black transition-colors"></i>
                        </div>
                    </div>
                </Button>}
        </div>

        {items.length > 0 ? (
          <div className="flex-1 min-h-[600px] animate-fade-in stagger-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-20">
              {items.map((item, index) => {
                if (activeTab === FavoriteTab.Anime) {
                  const animeItem = item as AnimeWithStatus;
                  const status = animeItem.status as FavoriteStatus;
                  const statusColor = getStatusColor(status);
                  const statusIcon = getStatusIcon(status);
                  const showBadge = activeCategory === FILTER_ALL;
                  return (
                    <div key={item.id} className="w-full">
                      <AnimeCard
                        anime={animeItem}
                        index={index}
                        showBookmark={false}
                        overlaySlot={
                          showBadge ? (
                            <div className="bg-black/80 border border-white/10 px-3 py-1.5 rounded-lg flex items-center justify-center gap-2 backdrop-blur-md shadow-lg">
                              <i className={`fa-solid ${statusIcon} text-xs ${statusColor}`}></i>
                              <span className={`text-xs font-black uppercase tracking-wide leading-none ${statusColor}`}>
                                {t(`favorites.tabs.${status}`)}
                              </span>
                            </div>
                          ) : undefined
                        }
                      />
                    </div>
                  );
                } else {
                  return (
                    <div key={item.id} className="w-full h-full">
                      <SearchCollectionCard collection={item as Collection} />
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-[32px] bg-white/5 text-center animate-fade-in stagger-2">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5">
              <i className="fa-solid fa-layer-group text-3xl text-gray-500"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t('favorites.emptyTitle')}</h3>
            <p className="text-gray-400 mb-8 max-w-sm">{t('favorites.emptyDescription')}</p>
            <Button onClick={() => navigate(activeTab === FavoriteTab.Anime ? AppRoute.Catalog : AppRoute.Collections)}>
              {activeTab === FavoriteTab.Anime ? t('favorites.exploreCatalog') : t('collections.backToAll')}
            </Button>
          </div>
        )}

      </div>
    </div>;
};
export default Favorites;