import { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { animeService } from '../services/apiService';
import { useSearchParams } from 'react-router';
import { useAnimeStore } from '../store/animeStore';

export const useWatchPageLogic = (id: number) => {
    const [searchParams, setSearchParams] = useSearchParams();
    /** Explicit user choice; `null` until the user picks a server. */
    const [selectedServer, setSelectedServer] = useState<string | null>(null);
    const [isVideoLoading, setIsVideoLoading] = useState(true);

    // Use Global Store
    const addToHistory = useAnimeStore((state) => state.addToHistory);
    const globalHistory = useAnimeStore((state) => state.history);

    /** Parse episode from URL or default to 1 */
    const currentEpisodeNumber = parseInt(searchParams.get('ep') || '1');

    const {
        data: anime,
        isLoading: isAnimeLoading,
        error,
    } = useQuery({
        queryKey: ['animeDetails', id],
        queryFn: () => animeService.getAnimeDetails(id),
        enabled: !!id,
    });

    const historyProgress = useMemo(() => {
        const map: Record<number, number> = {};
        globalHistory.forEach((item) => {
            if (item.anime.id === id) {
                map[item.episode] = item.progress;
            }
        });
        return map;
    }, [globalHistory, id]);

    const episodes = useMemo(() => anime?.episodesList || [], [anime]);

    const currentEpisode = useMemo(() => {
        return episodes.find((e) => e.number === currentEpisodeNumber) || episodes[0];
    }, [episodes, currentEpisodeNumber]);

    /** Derived default server: first available voiceover (was an effect writing state). */
    const currentServer = selectedServer ?? anime?.voiceovers?.[0]?.id ?? 'ru_0';

    /**
     * Latest progress snapshot for the history recorder. Read through a ref so
     * the effect fires on episode/anime changes only — listing historyProgress
     * as a dependency would re-record (and re-timestamp) on every store write,
     * feeding its own dependency: an infinite update loop.
     */
    const historyProgressRef = useRef(historyProgress);
    useEffect(() => {
        historyProgressRef.current = historyProgress;
    }, [historyProgress]);

    /** Record History when episode changes */
    useEffect(() => {
        if (anime && currentEpisode) {
            addToHistory({
                id: `hist_${anime.id}_${currentEpisode.number}`,
                anime: {
                    id: anime.id,
                    title: anime.title,
                    description: anime.description,
                    thumbnailUrl: anime.thumbnailUrl,
                    coverUrl: anime.coverUrl,
                    rating: anime.rating,
                    genres: anime.genres,
                    year: anime.year,
                    studio: anime.studio,
                    type: anime.type,
                },
                episode: currentEpisode.number,
                progress: historyProgressRef.current[currentEpisode.number] || 5, // Start with 5% mock progress
            });
        }
    }, [anime, currentEpisode, addToHistory]);

    /** Actions */
    const actions = {
        setEpisode: (epNumber: number) => {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.set('ep', epNumber.toString());
                return newParams;
            });
            setIsVideoLoading(true);
        },
        setServer: (serverId: string) => {
            setSelectedServer(serverId);
            setIsVideoLoading(true);
        },
        onVideoLoad: () => setIsVideoLoading(false),
    };

    /** Simulate video loading delay */
    useEffect(() => {
        if (currentEpisode) {
            const timer = setTimeout(() => {
                setIsVideoLoading(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [currentEpisodeNumber, currentServer, currentEpisode]);

    return {
        state: {
            anime,
            currentEpisode,
            episodes,
            isLoading: isAnimeLoading,
            isVideoLoading,
            error,
            currentServer,
            currentEpisodeNumber,
            historyProgress,
        },
        actions,
    };
};
