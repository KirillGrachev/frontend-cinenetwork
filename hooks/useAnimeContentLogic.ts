import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { AnimeDetails } from '../types';
import { useLocale } from '../context/LocaleContext';

export const useAnimeContentLogic = (anime: AnimeDetails) => {
    const { t } = useLocale();
    const navigate = useNavigate();

    // --- Viewer State ---
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);

    const openViewer = (index: number) => {
        setViewerIndex(index);
        setIsViewerOpen(true);
    };

    const closeViewer = () => setIsViewerOpen(false);

    // --- Data Lists (Full lists for Virtualization) ---
    const episodesList = anime.episodesList || [];
    const screenshots = anime.screenshots || [];
    const characters = anime.characters || [];

    // --- Helpers ---
    const formatSource = (src?: string) => {
        if (!src) return 'Original';
        return t(`media.anime.details.sources.${src.toLowerCase().replace(' ', '_')}`) || src;
    };

    const formatDuration = (val?: string) => {
        if (!val) return '—';
        const num = parseInt(val);
        if (isNaN(num)) return val;
        return t('media.anime.details.durationMin', { count: num });
    };

    const tabs = [
        { id: 'overview', label: t('media.anime.details.overview') },
        { id: 'episodes', label: t('media.anime.details.episodes') },
        { id: 'photos', label: t('media.anime.details.photos') },
        { id: 'characters', label: t('media.anime.details.characters') },
        { id: 'related', label: t('media.anime.details.related') },
    ];

    return {
        // Data
        tabs,

        // Lists
        episodesList,
        screenshots,
        characters,

        // Counts
        totalEpisodes: episodesList.length,
        totalPhotos: screenshots.length,
        totalCharacters: characters.length,

        // Viewer Actions
        isViewerOpen,
        viewerIndex,
        openViewer,
        closeViewer,

        // Helpers
        formatSource,
        formatDuration,
        t,
        navigate,
    };
};
