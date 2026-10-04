import React, { useMemo } from 'react';
import { useParams } from 'react-router';
import { useLocale } from '../context/LocaleContext';
import { useAnimePageLogic } from '../hooks/useAnimePageLogic';
import AnimeHero from './anime/AnimeHero';
import AnimeContent from './anime/AnimeContent';
import NotFound from './NotFound';
import SEO from './SEO';
import { generateAnimeSchema, generateBreadcrumbSchema } from '../utils/seoUtils';
import { AppRoute } from '../types';

import AnimePageSkeleton from './skeletons/AnimePageSkeleton';

const AnimePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useLocale();
    const animeId = Number(id);

    const { state, actions } = useAnimePageLogic(animeId);
    const { anime, isLoading, error, activeTab, currentStatus } = state;

    // Generate Structured Data (Entity + Breadcrumbs)
    const structuredData = useMemo(() => {
        if (!anime) return undefined;

        const entitySchema = generateAnimeSchema(anime, window.location.href, t('common.appName'));

        const breadcrumbSchema = generateBreadcrumbSchema([
            { name: t('navbar.home'), path: AppRoute.Home },
            { name: t('navbar.catalog'), path: AppRoute.Catalog },
            { name: anime.title, path: window.location.href },
        ]);

        return [entitySchema, breadcrumbSchema];
    }, [anime, t]);

    if (isLoading) {
        return <AnimePageSkeleton />;
    }

    // If ID is invalid (NaN) or API returned error/no data, show global 404
    if (isNaN(animeId) || error || !anime) {
        return <NotFound />;
    }

    return (
        <div className="page-reveal min-h-screen bg-background-primary pb-20">
            <SEO
                title={t(anime.title)}
                description={t(anime.description)}
                image={anime.coverUrl}
                type="video.tv_show"
                structuredData={structuredData}
            />

            <AnimeHero
                anime={anime}
                currentStatus={currentStatus}
                onUpdateStatus={actions.updateStatus}
            />

            <AnimeContent anime={anime} activeTab={activeTab} setActiveTab={actions.setActiveTab} />
        </div>
    );
};

export default AnimePage;
