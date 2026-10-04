import React, { useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import type { VirtuosoHandle } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import { useLocale } from '../context/LocaleContext';
import { useCharacterPageLogic } from '../hooks/useCharacterPageLogic';
import Button from './ui/Button';
import AnimeCard from './AnimeCard';
import { AppRoute, ToastType } from '../types';
import { useToast } from '../context/ToastContext';
import SEO from './SEO';
import CharacterPageSkeleton from './skeletons/CharacterPageSkeleton';

const CharacterPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useLocale();
    const { showToast } = useToast();
    const characterId = Number(id);

    const { state } = useCharacterPageLogic(characterId);
    const { character, isLoading, error } = state;

    const virtuosoRef = useRef<VirtuosoHandle>(null);

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate(AppRoute.Home);
        }
    };

    const handleCopyActorName = (name: string) => {
        navigator.clipboard.writeText(name);
        showToast(t('common.toasts.copiedName', { name }), ToastType.Success);
    };

    const originalVoiceActor = useMemo(() => {
        if (!character?.voiceActors) return null;
        return (
            character.voiceActors.find((va) => va.language === 'Japanese') ||
            character.voiceActors[0]
        );
    }, [character]);

    if (isLoading) {
        return <CharacterPageSkeleton />;
    }

    if (error || !character) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-32 text-center px-4">
                <h2 className="text-2xl font-bold text-white mb-2">{t('character.notFound')}</h2>
                <Button
                    onClick={() => navigate(AppRoute.Home)}
                    variant="secondary"
                    className="mt-4"
                >
                    {t('navbar.backToHome')}
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-primary pt-24 pb-20 relative overflow-x-hidden">
            <SEO
                title={character.name}
                description={t(character.description)}
                image={character.imageUrl}
                type="article"
            />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="mb-8 animate-fade-in">
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

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                    {/* Left Column */}
                    <div className="w-full lg:w-[320px] flex-shrink-0 animate-fade-in space-y-6">
                        <div className="w-full aspect-[2/3] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl relative group">
                            {character.imageUrl ? (
                                <img
                                    src={character.imageUrl}
                                    alt={character.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-panel-secondary text-gray-600">
                                    <i className="fa-solid fa-user text-6xl mb-4"></i>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>

                        {originalVoiceActor && (
                            <div
                                onClick={() => handleCopyActorName(originalVoiceActor.name)}
                                className="bg-panel-secondary border border-border-medium hover:border-white/20 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:bg-white/5 group active:opacity-90"
                                role="button"
                                tabIndex={0}
                                title={t('common.ui.copyName')}
                            >
                                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                                    {t('character.voiceActor')}
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-panel-tertiary overflow-hidden flex-shrink-0 border border-white/5 group-hover:border-white/20 transition-colors">
                                        {originalVoiceActor.imageUrl ? (
                                            <img
                                                src={originalVoiceActor.imageUrl}
                                                alt={originalVoiceActor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600 bg-black/20">
                                                <i className="fa-solid fa-microphone"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-base group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                            {originalVoiceActor.name}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5">Japanese</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 w-full min-w-0 animate-fade-in stagger-1">
                        <div className="mb-10">
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-2 tracking-tight break-words">
                                {character.name}
                            </h1>
                            {character.originalName && (
                                <p className="text-xl text-gray-500 font-medium">
                                    {character.originalName}
                                </p>
                            )}
                            <div className="mt-4 flex items-center gap-3">
                                <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold text-white border border-white/10 uppercase tracking-wide">
                                    {t(
                                        `media.anime.details.characterRoles.${character.role.toLowerCase()}`,
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="mb-14">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-align-left text-blue-500"></i>
                                {t('character.about')}
                            </h2>
                            <div className="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap break-words">
                                {t(character.description)}
                            </div>
                        </div>

                        <div className="w-full min-w-0">
                            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                <h2 className="text-2xl font-bold text-white">
                                    {t('character.appearsIn')}
                                </h2>
                                <span className="text-sm font-bold text-gray-500 bg-panel-secondary px-3 py-1 rounded-lg border border-white/5">
                                    {character.anime.length} {t('common.ui.titles').toLowerCase()}
                                </span>
                            </div>

                            {/* Virtualized Horizontal List */}
                            <div className="relative group/list">
                                <Virtuoso
                                    ref={virtuosoRef}
                                    horizontalDirection
                                    data={character.anime}
                                    className="h-[320px] md:h-[520px] w-full no-scrollbar"
                                    itemContent={(index, anime) => (
                                        <div className="w-[160px] md:w-[220px] pr-4 md:pr-6 py-2 h-full">
                                            <AnimeCard anime={anime} index={index} />
                                        </div>
                                    )}
                                />
                                {/* Nav Arrow (Desktop) */}
                                {character.anime.length > 3 && (
                                    <button
                                        onClick={() =>
                                            virtuosoRef.current?.scrollBy({
                                                left: 300,
                                                behavior: 'smooth',
                                            })
                                        }
                                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hidden md:flex items-center justify-center opacity-0 group-hover/list:opacity-100 transition-all hover:bg-white hover:text-black shadow-2xl hover:scale-110 active:opacity-80"
                                    >
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharacterPage;
