import { describe, it, expect, beforeEach } from 'vitest';
import { useAnimeStore } from './animeStore';
import type { NewHistoryItem } from './animeStore';
import { FavoriteStatus, VideoQuality, AnimeGenre } from '../types';
import type { Anime } from '../types';

const anime: Anime = {
    id: 1,
    title: 'Test',
    description: 'd',
    thumbnailUrl: '/t.jpg',
    coverUrl: '/c.jpg',
    rating: 8,
    genres: [AnimeGenre.Action],
    year: 2024,
};

const historyEntry = (episode: number): NewHistoryItem => ({
    id: `hist_1_${episode}`,
    anime,
    episode,
    progress: 10,
});

describe('animeStore', () => {
    beforeEach(() => {
        useAnimeStore.setState({
            favorites: {},
            history: [],
            playerSettings: { volume: 0.8, quality: VideoQuality.Q1080p, muted: false },
        });
    });

    describe('favorites', () => {
        it('adds a favorite with the given status', () => {
            useAnimeStore.getState().toggleFavorite(anime, FavoriteStatus.Watching);
            const fav = useAnimeStore.getState().favorites[1];
            expect(fav?.status).toBe(FavoriteStatus.Watching);
            expect(fav?.updatedAt).toBeTypeOf('number');
        });

        it('toggling the same status removes the entry', () => {
            const { toggleFavorite } = useAnimeStore.getState();
            toggleFavorite(1, FavoriteStatus.Planned);
            toggleFavorite(1, FavoriteStatus.Planned);
            expect(useAnimeStore.getState().favorites[1]).toBeUndefined();
        });

        it('switching to another status overwrites instead of removing', () => {
            const { toggleFavorite } = useAnimeStore.getState();
            toggleFavorite(anime, FavoriteStatus.Planned);
            toggleFavorite(anime, FavoriteStatus.Completed);
            expect(useAnimeStore.getState().favorites[1].status).toBe(FavoriteStatus.Completed);
        });

        it('removeFromFavorites deletes by id', () => {
            useAnimeStore.getState().toggleFavorite(1);
            useAnimeStore.getState().removeFromFavorites(1);
            expect(useAnimeStore.getState().favorites).toEqual({});
        });
    });

    describe('history', () => {
        it('prepends new entries and stamps them', () => {
            const before = Date.now();
            useAnimeStore.getState().addToHistory(historyEntry(1));

            const [entry] = useAnimeStore.getState().history;
            expect(entry.episode).toBe(1);
            expect(entry.timestamp).toBeGreaterThanOrEqual(before);
            expect(() => new Date(entry.lastWatchedAt).toISOString()).not.toThrow();
        });

        it('re-watching an episode moves it to the top without duplicating', () => {
            const { addToHistory } = useAnimeStore.getState();
            addToHistory(historyEntry(1));
            addToHistory(historyEntry(2));
            addToHistory(historyEntry(1));

            const history = useAnimeStore.getState().history;
            expect(history).toHaveLength(2);
            expect(history[0].episode).toBe(1);
        });

        it('caps the persisted history at 100 entries', () => {
            const { addToHistory } = useAnimeStore.getState();
            for (let episode = 1; episode <= 120; episode++) {
                addToHistory(historyEntry(episode));
            }
            const history = useAnimeStore.getState().history;
            expect(history).toHaveLength(100);
            expect(history[0].episode).toBe(120); // newest kept
        });

        it('removes and clears', () => {
            const { addToHistory, removeFromHistory, clearHistory } = useAnimeStore.getState();
            addToHistory(historyEntry(1));
            addToHistory(historyEntry(2));

            removeFromHistory('hist_1_1');
            expect(useAnimeStore.getState().history).toHaveLength(1);

            clearHistory();
            expect(useAnimeStore.getState().history).toEqual([]);
        });
    });

    describe('playerSettings', () => {
        it('merges partial updates', () => {
            useAnimeStore.getState().updatePlayerSettings({ muted: true });
            const settings = useAnimeStore.getState().playerSettings;
            expect(settings).toEqual({ volume: 0.8, quality: VideoQuality.Q1080p, muted: true });
        });
    });
});
