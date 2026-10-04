import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../tests/renderWithProviders';
import ErrorBoundary from './ErrorBoundary';
import SEO from './SEO';

describe('ErrorBoundary', () => {
    beforeEach(() => {
        // Silence React's expected error logging for the throw test.
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('renders children when nothing throws', async () => {
        await renderWithProviders(
            <ErrorBoundary>
                <div>protected content</div>
            </ErrorBoundary>,
        );
        expect(await screen.findByText('protected content')).toBeInTheDocument();
    });

    it('shows the error fallback when a child throws', async () => {
        const Bomb: React.FC = () => {
            throw new Error('test explosion');
        };

        await renderWithProviders(
            <ErrorBoundary>
                <Bomb />
            </ErrorBoundary>,
        );

        // The fallback prints the raw error into a "system output" pane and
        // offers recovery actions (reload / back to home).
        expect(await screen.findByText(/test explosion/)).toBeInTheDocument();
        expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(2);
    });
});

describe('SEO', () => {
    it('renders nothing visible but updates document metadata', async () => {
        await renderWithProviders(
            <SEO title="Anime Page" description="Some description" type="article" />,
        );

        // SEO renders nothing into the body...
        await waitFor(() => expect(screen.queryByText(/Anime Page/)).toBeNull());

        await expect.poll(() => document.title.replace(/ \| .*$/, '')).toBe('Anime Page');
        await expect
            .poll(() =>
                document.head.querySelector('meta[property="og:type"]')?.getAttribute('content'),
            )
            .toBe('article');
    });
});
