import React from 'react';
import { useLocale } from '../../../context/LocaleContext';
import AnimeImage from '../../AnimeImage';
interface AnimePhotosProps {
    photos: string[];
    totalPhotos: number;
    openViewer: (index: number) => void;
}
const AnimePhotos: React.FC<AnimePhotosProps> = ({ photos, totalPhotos, openViewer }) => {
    const { t } = useLocale();
    return (
        <div className="flex flex-col min-h-[500px] page-reveal">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">{t('media.anime.details.photos')}</h3>
                <span className="text-2xl text-gray-500 font-bold">{totalPhotos}</span>
            </div>
            {photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                    {photos.map((src, index) => (
                        <div
                            key={index}
                            onClick={() => openViewer(index)}
                            className="relative aspect-video rounded-xl overflow-hidden bg-panel-secondary cursor-pointer group border border-white/5 hover:border-white/20 transition-all"
                        >
                            <AnimeImage
                                src={src}
                                alt={`Screenshot`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                placeholderClassName="w-8 h-8 rounded-xl"
                                placeholderIconClassName="text-xs"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <div className="w-10 h-10 rounded-2xl bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100 border border-white/10">
                                    <i className="fa-solid fa-expand text-xs"></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-gray-500 border border-dashed border-white/5 rounded-3xl bg-white/5">
                    {t('search.noResults')}
                </div>
            )}
        </div>
    );
};
export default AnimePhotos;
