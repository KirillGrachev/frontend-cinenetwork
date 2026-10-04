import React from 'react';
import { useNavigate } from 'react-router';
import type { Episode } from '../../../types';
import { useLocale } from '../../../context/LocaleContext';
import AnimeImage from '../../AnimeImage';
interface AnimeEpisodesProps {
    episodes: Episode[];
    animeId: number;
    totalEpisodes: number;
    formatDuration: (val?: string) => string;
}
const AnimeEpisodes: React.FC<AnimeEpisodesProps> = ({
    episodes,
    animeId,
    totalEpisodes,
    formatDuration,
}) => {
    const { t } = useLocale();
    const navigate = useNavigate();
    return (
        <div className="flex flex-col min-h-[500px] animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                    {t('media.anime.details.allEpisodes')}
                </h3>
                <span className="text-2xl text-gray-500 font-bold">{totalEpisodes}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-20">
                {episodes.map((ep) => (
                    <div key={ep.id} className="w-full">
                        <div
                            className="group cursor-pointer"
                            onClick={() => navigate(`/watch/${animeId}?ep=${ep.number}`)}
                        >
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-panel-secondary mb-3 border border-white/5 group-hover:border-white/20 transition-all">
                                <AnimeImage
                                    src={ep.image}
                                    alt={ep.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    placeholderClassName="w-8 h-8 rounded-xl"
                                    placeholderIconClassName="text-xs"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-10 h-10 rounded-xl bg-panel-secondary/90 backdrop-blur-sm flex items-center justify-center text-white shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                        <i className="fa-solid fa-play text-sm ml-0.5"></i>
                                    </div>
                                </div>
                                <span className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-white border border-white/5">
                                    {formatDuration(ep.duration)}
                                </span>
                            </div>
                            <h4 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors truncate">
                                {ep.number}. {ep.title}
                            </h4>
                            <span className="text-xs text-gray-500">{ep.airDate}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default AnimeEpisodes;
