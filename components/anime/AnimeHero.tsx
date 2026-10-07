
import React, { Fragment } from 'react';
import { useNavigate } from 'react-router';
import { Listbox, Transition } from '@headlessui/react';
import { AnimeDetails, FavoriteStatus, AppRoute } from '../../types';
import Button from '../ui/Button';
import AnimeImage from '../AnimeImage';
import { useLocale } from '../../context/LocaleContext';

interface AnimeHeroProps {
  anime: AnimeDetails;
  currentStatus: FavoriteStatus | null;
  onUpdateStatus: (status: FavoriteStatus | null) => void;
  onPlayTrailer: () => void;
}

const AnimeHero: React.FC<AnimeHeroProps> = ({ 
    anime, 
    currentStatus, 
    onUpdateStatus,
    onPlayTrailer
}) => {
  const { t } = useLocale();
  const navigate = useNavigate();

  const statuses = [
      { id: FavoriteStatus.Watching, icon: 'fa-play', label: t('favorites.tabs.watching') },
      { id: FavoriteStatus.Planned, icon: 'fa-bookmark', label: t('favorites.tabs.planned') },
      { id: FavoriteStatus.Completed, icon: 'fa-check', label: t('favorites.tabs.completed') },
      { id: FavoriteStatus.Paused, icon: 'fa-pause', label: t('favorites.tabs.paused') },
      { id: FavoriteStatus.Dropped, icon: 'fa-trash', label: t('favorites.tabs.dropped') },
  ];

  const handleBack = () => {
      if (window.history.state && window.history.state.idx > 0) {
          navigate(-1);
      } else {
          navigate(AppRoute.Home);
      }
  };

  const handleWatchClick = () => {
      navigate(`/watch/${anime.id}`);
  };

  const activeStatusObj = statuses.find(s => s.id === currentStatus);
  const buttonVariant = currentStatus ? 'primary' : 'secondary';

  return (
    <div className="relative w-full bg-background-primary z-20">
        {/* Backdrop Image Container */}
        {/* CHANGED: Added max-h-[900px] limit */}
        <div className="absolute inset-0 h-[50vh] md:h-[70vh] max-h-[900px] overflow-hidden">
            {/* Image Layer */}
            <div className="absolute inset-0 z-0">
                <AnimeImage 
                    src={anime.coverUrl} 
                    alt={t(anime.title)} 
                    className="w-full h-full object-cover"
                />
            </div>
            
            {/* Gradients */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background-primary via-background-primary/60 to-transparent"></div>
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-background-primary/90 via-background-primary/40 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative container mx-auto px-4 md:px-8 pt-24 md:pt-48 pb-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end z-20">
            
            {/* Back Button */}
            <div className="absolute top-24 left-4 md:left-8 z-30">
                <Button 
                    variant="ghost" 
                    size="md" 
                    icon="fa-solid fa-arrow-left" 
                    onClick={handleBack}
                    className="pl-0 hover:!bg-transparent text-white/70 hover:text-white transition-colors"
                >
                    {t('common.ui.back')}
                </Button>
            </div>

            {/* Poster */}
            {/* CHANGED: 2xl:w-80 (Larger poster on huge screens) */}
            <div className="hidden md:block w-64 2xl:w-80 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative z-10 origin-bottom-left bg-panel-secondary">
                <AnimeImage src={anime.thumbnailUrl} alt={t(anime.title)} className="w-full aspect-[2/3] object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 animate-fade-in w-full">
                
                {/* Mobile Poster */}
                <div className="md:hidden w-28 rounded-xl overflow-hidden shadow-lg border border-white/10 mb-4 bg-panel-secondary">
                     <AnimeImage src={anime.thumbnailUrl} alt={t(anime.title)} className="w-full aspect-[2/3] object-cover" />
                </div>

                {/* CHANGED: 2xl:text-6xl (Larger title) */}
                <h1 className="text-2xl sm:text-3xl md:text-5xl 2xl:text-6xl font-black text-white mb-2 leading-tight uppercase italic tracking-wide drop-shadow-lg">
                    {t(anime.title)}
                </h1>
                
                {/* CHANGED: 2xl:text-lg (Larger meta text) */}
                <div className="flex items-center gap-3 text-xs md:text-base 2xl:text-lg font-bold text-gray-300 mb-6">
                    <span className="flex items-center gap-1 text-white">
                        <i className="fa-solid fa-star text-xs md:text-sm text-yellow-400"></i> {anime.rating}
                    </span>
                    {anime.ageRating && <span className="bg-white/10 px-2 py-0.5 rounded-md text-[10px] md:text-xs 2xl:text-sm border border-white/10">{anime.ageRating}</span>}
                    <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                    <span>{anime.year}</span>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button 
                        variant="primary" 
                        size="lg" 
                        className="rounded-xl px-8 flex-1 md:flex-none h-12 md:h-14 text-sm md:text-base"
                        icon="fa-solid fa-play"
                        onClick={handleWatchClick}
                    >
                        {t('media.anime.details.watch')}
                    </Button>
                    
                    {/* Status Dropdown (Listbox) */}
                    <div className="relative min-w-[200px]">
                        <Listbox value={currentStatus} onChange={onUpdateStatus}>
                            {({ open }) => (
                                <>
                                    <Listbox.Button 
                                        as={Button}
                                        variant={buttonVariant}
                                        size="lg"
                                        className={`w-full rounded-xl px-4 md:px-6 h-12 md:h-14 border transition-colors flex items-center justify-center ${
                                            currentStatus 
                                            ? 'border-white hover:bg-gray-200' 
                                            : 'border-border-medium bg-black/40 backdrop-blur-md hover:bg-white/10'
                                        }`}
                                    >
                                        <i className={`fa-solid ${activeStatusObj ? activeStatusObj.icon : 'fa-bookmark'} ${currentStatus ? '' : 'mr-0 md:mr-2'}`}></i>
                                        {currentStatus && <span className="ml-2 font-bold hidden sm:inline">{activeStatusObj?.label}</span>}
                                        {!currentStatus && <span className="ml-2 hidden sm:inline">{t('hero.watchLater')}</span>}
                                    </Listbox.Button>

                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                    >
                                        <Listbox.Options className="absolute top-full left-0 mt-2 min-w-full whitespace-nowrap bg-gray-900 rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] overflow-hidden z-[100] outline-none ring-1 ring-white/10 p-1.5 flex flex-col gap-0.5 origin-top-left">
                                            {statuses.map((status) => (
                                                <Listbox.Option
                                                    key={status.id}
                                                    value={status.id}
                                                    className={({ active, selected }) => `
                                                        flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer
                                                        ${active || selected ? 'bg-white text-black shadow-sm' : 'text-gray-300 hover:bg-white/10 hover:text-white'}
                                                    `}
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <i className={`fa-solid ${status.icon} w-5 text-center`}></i>
                                                            {status.label}
                                                            {selected && <i className="fa-solid fa-check ml-auto text-xs"></i>}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                            
                                            {currentStatus && (
                                                <div className="border-t border-white/5 pt-1.5 mt-1">
                                                    <Listbox.Option
                                                        value={null}
                                                        className={({ active }) => `
                                                            flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-400 w-full text-left transition-colors cursor-pointer
                                                            ${active ? 'bg-red-500/10 text-red-300' : 'hover:bg-red-500/10 hover:text-red-300'}
                                                        `}
                                                    >
                                                        <i className="fa-solid fa-xmark w-5 text-center"></i>
                                                        {t('common.ui.delete')}
                                                    </Listbox.Option>
                                                </div>
                                            )}
                                        </Listbox.Options>
                                    </Transition>
                                </>
                            )}
                        </Listbox>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AnimeHero;
