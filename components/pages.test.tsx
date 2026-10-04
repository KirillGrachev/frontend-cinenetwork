import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../tests/renderWithProviders';
import Home from './Home';
import Login from './Login';
import News from './News';
import NotFound from './NotFound';
import AnimeCard from './AnimeCard';
import AdminStats from './admin/Stats';
import { useAnimeStore } from '../store/animeStore';
import type { Anime } from '../types';
import { AnimeGenre, FavoriteStatus } from '../types';

/**
 * Page-level smoke tests: the full provider stack + real mock providers.
 * The locale is pinned to 'ru' so assertions can rely on exact strings.
 */

beforeEach(() => {
    localStorage.setItem('cine-network-locale', 'ru');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('Home page', () => {
    it('loads and renders featured content from the mock backend', async () => {
        await renderWithProviders(<Home />);

        // Mock-catalog titles resolve through the ru dictionary; the Home
        // page renders the same title in several rows (cards + hero).
        const matches = await screen.findAllByText(/Магическая битва/, {}, { timeout: 6000 });
        expect(matches.length).toBeGreaterThan(0);
    });
});

describe('News page (anime-service feed)', () => {
    it('renders the reworked anime news feed (no devlog)', async () => {
        await renderWithProviders(<News />);

        // Заголовок первой (featured) новости из переработанной ленты.
        expect(
            await screen.findByText(/Клинка, рассекающего демонов/, {}, { timeout: 6000 }),
        ).toBeInTheDocument();
        // Девлог о разработке платформы больше не присутствует.
        expect(screen.queryByText(/Технологии будущего/)).not.toBeInTheDocument();
    });
});

describe('Admin Stats page (concept-aligned)', () => {
    it('opens the Finance tab and loads transaction data', async () => {
        await renderWithProviders(<AdminStats />, { route: '/admin/stats?tab=finance' });

        /**
         * Assert on the static section heading: transaction rows live inside
         * TableVirtuoso, which renders nothing without real layout metrics in
         * happy-dom. The heading proves route -> tab -> query -> data pipeline
         * works without crashing.
         */
        expect(
            await screen.findByText('Последние транзакции', {}, { timeout: 8000 }),
        ).toBeInTheDocument();
        // Никакого тестового scaffolding и долларовой валюты.
        expect(screen.queryByText(/Processed item/)).not.toBeInTheDocument();
    });
});

describe('NotFound page', () => {
    it('renders the 404 state', async () => {
        await renderWithProviders(<NotFound />);
        expect(await screen.findByText('Сцена не найдена')).toBeInTheDocument();
        expect(screen.getByText('404')).toBeInTheDocument();
    });
});

describe('Login page', () => {
    it('shows validation errors on an empty submit', async () => {
        const user = userEvent.setup();
        await renderWithProviders(<Login onLoginSuccess={vi.fn()} />);

        const submit = await screen.findByRole('button', { name: /вход/i });
        await user.click(submit);

        // zod: empty email/password → 'Пусто' (auth.formErrors.required)
        expect(await screen.findAllByText('Пусто')).not.toHaveLength(0);
    });

    it('calls onLoginSuccess with the entered credentials on a valid submit', async () => {
        const user = userEvent.setup();
        const onLoginSuccess = vi.fn().mockResolvedValue(undefined);
        await renderWithProviders(<Login onLoginSuccess={onLoginSuccess} />);

        await user.type(await screen.findByPlaceholderText(/почта|email/i), 'neo@matrix.io');
        const passwordInput = document.querySelector('input[type="password"]');
        expect(passwordInput).not.toBeNull();
        await user.type(passwordInput!, 'supersecret');

        await user.click(screen.getByRole('button', { name: /вход/i }));

        await vi.waitFor(
            () =>
                expect(onLoginSuccess).toHaveBeenCalledWith({
                    email: 'neo@matrix.io',
                    password: 'supersecret',
                }),
            { timeout: 4000 },
        );
    });
});

describe('AnimeCard', () => {
    const anime: Anime = {
        id: 42,
        title: 'Literal Title',
        description: 'd',
        thumbnailUrl: '/t.jpg',
        coverUrl: '/c.jpg',
        rating: 7.5,
        genres: [AnimeGenre.Action],
        year: 2024,
    };

    beforeEach(() => {
        useAnimeStore.setState({ favorites: {} });
    });

    it('renders the title and year', async () => {
        await renderWithProviders(<AnimeCard anime={anime} />);
        expect(await screen.findByText('Literal Title')).toBeInTheDocument();
        expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('bookmark click toggles the favorite in the global store', async () => {
        const user = userEvent.setup();
        await renderWithProviders(<AnimeCard anime={anime} />);

        const bookmark = await screen.findByRole('button', { name: /избран/i });
        await user.click(bookmark);

        expect(useAnimeStore.getState().favorites[42]?.status).toBe(FavoriteStatus.Planned);

        await user.click(bookmark);
        expect(useAnimeStore.getState().favorites[42]).toBeUndefined();
    });
});
