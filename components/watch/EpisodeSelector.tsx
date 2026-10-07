
import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Episode } from '../../types';
import { useLocale } from '../../context/LocaleContext';
import AnimeImage from '../AnimeImage';

interface EpisodeSelectorProps {
    episodes: Episode[];
    currentEpisodeNumber: number;
    onSelect: (epNumber: number) => void;
    historyProgress?: Record<number, number>;
}

const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({ 
    episodes, 
    currentEpisodeNumber, 
    onSelect, 
    historyProgress = {} 
}) => {
    const { t } = useLocale();

    return (
        <div className="bg-panel-primary border border-border-medium rounded-3xl overflow-hidden flex flex-col h-[850px] sticky top-24">
            <div className="px-6 py-5 border-b border-border-light flex justify-between items-center bg-white/5 flex-shrink-0">
                <h3 className="font-bold text-white text-base uppercase tracking-wide">{t('media.anime.details.episodes')}</h3>
                <span className="text-xs font-bold text-gray-500 bg-black/20 px-3 py-1 rounded-full border border-white/5">{episodes.length}</span>
            </div>
            
            <div className="flex-1 min-h-0">
                <Virtuoso
                    style={{ height: '100%' }}
                    data={episodes}
                    itemContent={(index, ep) => {
                        const isActive = ep.number === currentEpisodeNumber;
                        const progress = historyProgress[ep.number] || 0;
                        
                        return (
                            <div className="px-3 py-1">
                                <div 
                                    onClick={() => onSelect(ep.number)}
                                    className={`flex gap-3 p-2 rounded-xl cursor-pointer transition-all border group ${
                                        isActive 
                                        ? 'bg-white/10 border-white/20' 
                                        : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                                    }`}
                                >
                                    {/* Episode Thumbnail */}
                                    <div className="relative w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-black">
                                        <AnimeImage 
                                            src={ep.image} 
                                            alt={ep.title} 
                                            className={`w-full h-full object-cover transition-transform duration-500 ease-out ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'} group-hover:scale-105`} 
                                            placeholderClassName="w-8 h-8 rounded-xl"
                                            placeholderIconClassName="text-xs"
                                            isRectangular={false}
                                        />
                                        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            {/* Play Button */}
                                            {/* CHANGED: rounded-full -> rounded-xl */}
                                            <div className="w-10 h-10 rounded-xl bg-panel-secondary/90 backdrop-blur-sm text-white flex items-center justify-center shadow-lg border border-white/10">
                                                <i className="fa-solid fa-play text-xs pl-0.5"></i>
                                            </div>
                                        </div>
                                        {isActive && (
                                            <div className="absolute inset-0 ring-2 ring-inset ring-white/20 rounded-lg pointer-events-none"></div>
                                        )}
                                        
                                        {/* Progress Bar */}
                                        {progress > 0 && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
                                                <div 
                                                    className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" 
                                                    style={{ width: `${progress}%` }} 
                                                />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 py-1 flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                                                {t('media.schedule.episodeShort')} {ep.number}
                                            </span>
                                        </div>
                                        <h4 className={`text-sm font-bold leading-tight line-clamp-2 ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                            {ep.title}
                                        </h4>
                                        <span className="text-xs text-gray-500 mt-1">{ep.duration}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                    className="custom-scrollbar"
                />
            </div>
        </div>
    );
};

export default EpisodeSelector;
