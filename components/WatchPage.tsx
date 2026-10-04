import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useLocale } from '../context/LocaleContext';
import { useWatchPageLogic } from '../hooks/useWatchPageLogic';
import Button from './ui/Button';
import PlayerPlaceholder from './watch/PlayerPlaceholder';
import EpisodeSelector from './watch/EpisodeSelector';
import CommentsSection from './watch/CommentsSection';
import NotFound from './NotFound';
import SEO from './SEO';
import { generateEpisodeSchema, generateBreadcrumbSchema } from '../utils/seoUtils';
import { AppRoute } from '../types';
import WatchPageSkeleton from './skeletons/WatchPageSkeleton';
import WatchPageLayout from './layouts/WatchPageLayout';

const WatchPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useLocale();
    const animeId = Number(id);

    const { state, actions } = useWatchPageLogic(animeId);
    const {
        anime,
        currentEpisode,
        episodes,
        isLoading,
        isVideoLoading,
        error,
        currentEpisodeNumber,
        historyProgress,
    } = state;

    /**
     * Handle Back Navigation to prevent history loops.
     */
    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate(`/anime/${animeId}`, { replace: true });
        }
    };

    // Generate Structured Data (Episode + Breadcrumbs)
    const structuredData = useMemo(() => {
        if (!anime || !currentEpisode) return undefined;

        const episodeSchema = generateEpisodeSchema(anime, currentEpisode, window.location.href);

        const breadcrumbSchema = generateBreadcrumbSchema([
            { name: t('navbar.home'), path: AppRoute.Home },
            { name: anime.title, path: `/anime/${anime.id}` },
            {
                name: `${t('media.schedule.episodeShort')} ${currentEpisode.number}`,
                path: window.location.href,
            },
        ]);

        return [episodeSchema, breadcrumbSchema];
    }, [anime, currentEpisode, t]);

    if (isLoading) {
        return <WatchPageSkeleton />;
    }

    if (error || !anime || !currentEpisode) {
        return <NotFound />;
    }

    const pageTitle = `${t(anime.title)} - ${t('media.schedule.episodeShort')} ${currentEpisode.number}`;

    return (
        <>
            <SEO
                title={pageTitle}
                description={t(anime.description)}
                image={currentEpisode.image}
                type="video.episode"
                structuredData={structuredData}
            />
            <WatchPageLayout
                backButton={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                icon="fa-solid fa-arrow-left"
                                onClick={handleBack}
                                className="pl-0 hover:!bg-transparent text-gray-400 hover:text-white"
                            >
                                {t('common.ui.back')}
                            </Button>
                            <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
                            <h1 className="text-lg font-bold text-gray-300 truncate max-w-[200px] md:max-w-md hidden sm:block">
                                {t(anime.title)}
                            </h1>
                            <span className="text-gray-600 hidden sm:inline">•</span>
                            <span className="text-white font-bold hidden sm:inline">
                                {t('media.schedule.episodeShort')} {currentEpisode.number}
                            </span>
                        </div>
                    </div>
                }
                leftColumn={
                    <>
                        <div className="mb-8 page-reveal">
                            <PlayerPlaceholder
                                thumbnail={currentEpisode.image}
                                isLoading={isVideoLoading}
                                onPlay={() => {
                                    // TODO(player): mount the real video player here.
                                }}
                            />
                        </div>
                        <div className="page-reveal">
                            <div className="flex flex-col gap-2 mb-6">
                                <h2 className="text-2xl font-bold text-white leading-tight">
                                    {currentEpisode.title}
                                </h2>
                                <p className="text-gray-500 text-sm line-clamp-2">
                                    {t(anime.description)}
                                </p>
                            </div>
                        </div>
                        <div className="page-reveal border-t border-white/5 pt-6">
                            <CommentsSection animeId={animeId} comments={anime.comments || []} />
                        </div>
                    </>
                }
                rightColumn={
                    <div className="page-reveal">
                        <EpisodeSelector
                            episodes={episodes}
                            currentEpisodeNumber={currentEpisodeNumber}
                            onSelect={actions.setEpisode}
                            historyProgress={historyProgress}
                        />
                    </div>
                }
            />
        </>
    );
};

export default WatchPage;
