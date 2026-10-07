import React from 'react';
import { useNavigate } from 'react-router';
import { Character } from '../../../types';
import { useLocale } from '../../../context/LocaleContext';
interface AnimeCharactersProps {
  characters: Character[];
  totalCharacters: number;
}
const AnimeCharacters: React.FC<AnimeCharactersProps> = ({
  characters,
  totalCharacters
}) => {
  const {
    t
  } = useLocale();
  const navigate = useNavigate();
  return <div className="flex flex-col min-h-[500px] animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">{t('media.anime.details.characters')}</h3>
                <span className="text-2xl text-gray-500 font-bold">{totalCharacters}</span>
            </div>
      {characters.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 pb-20">
          {characters.map((char) => (
            <div key={char.id} className="w-full">
              <div onClick={() => navigate(`/character/${char.id}`)} className="group cursor-pointer relative flex flex-col">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 bg-panel-secondary border border-white/5 group-hover:border-white/20 transition-all shadow-md group-hover:shadow-xl">
                  {char.imageUrl ? (
                    <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-panel-tertiary text-gray-600">
                      <i className="fa-solid fa-user text-3xl"></i>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <i className="fa-solid fa-arrow-right text-sm"></i>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-white leading-tight mb-1 group-hover:text-blue-400 transition-colors truncate">
                    {char.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    {t(`media.anime.details.characterRoles.${char.role.toLowerCase()}`)}
                  </p>
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
        </div>;
};
export default AnimeCharacters;