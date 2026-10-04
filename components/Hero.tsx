import React from 'react';
import type { Anime } from '../types';
import Button from './ui/Button';
import { useHeroLogic } from '../hooks/useHeroLogic';

interface HeroProps {
    anime: Anime;
}

const Hero: React.FC<HeroProps> = ({ anime }) => {
    const { state, actions } = useHeroLogic(anime);
    const { hasError, t, isBookmarked } = state;

    return (
        // CHANGED: Added max-h-[850px] to prevent text from sliding too low on tall 4k screens
        <div className="hidden md:flex relative w-full h-[50vh] md:h-[65vh] max-h-[850px] overflow-hidden flex-col justify-end pb-12 md:pb-20 bg-background-primary">
            <div className="absolute inset-0 z-0">
                {!hasError ? (
                    <img
                        src={anime.coverUrl}
                        alt={t(anime.title)}
                        className="w-full h-full object-cover object-center fade-in"
                        onError={actions.handleImageError}
                    />
                ) : (
                    <div className="w-full h-full bg-background-primary"></div>
                )}
            </div>

            <div
                className="absolute inset-0 z-10"
                style={{
                    background:
                        'linear-gradient(to top, rgba(5, 5, 5, 1) 0%, rgba(5, 5, 5, 0.9) 20%, transparent 60%)',
                }}
            ></div>

            {/* Grid Container */}
            <div className="relative z-20 container mx-auto px-4 md:px-8">
                {/* Content Block */}
                <div className="max-w-2xl 2xl:max-w-4xl animate-fade-in">
                    <div
                        className="text-3xl md:text-5xl 2xl:text-7xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                        role="heading"
                        aria-level={1}
                    >
                        {t(anime.title)}
                    </div>

                    <p className="text-gray-100 text-sm md:text-base 2xl:text-xl font-medium leading-relaxed mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-xl 2xl:max-w-3xl line-clamp-3">
                        {t(anime.description)}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Button variant="primary" size="lg" onClick={actions.handleWatch}>
                            {t('hero.watch')}
                        </Button>

                        <Button
                            variant="secondary"
                            size="lg"
                            icon={isBookmarked ? 'fa-solid fa-check' : 'fa-regular fa-bookmark'}
                            onClick={actions.handleWatchLater}
                            className={`transition-all duration-300 ${isBookmarked ? '!bg-white/10 !text-green-400 !border-green-500/30' : ''}`}
                        >
                            {isBookmarked ? t('common.ui.added') : t('hero.watchLater')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
