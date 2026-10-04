import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import NavbarLogo from './NavbarLogo';
import { renderWithProviders } from '../../tests/renderWithProviders';

describe('NavbarLogo', () => {
    it('falls back to a styled wordmark when the logo asset fails to load', async () => {
        await renderWithProviders(<NavbarLogo onClick={() => {}} />);

        const img = await screen.findByRole('img');
        fireEvent.error(img);

        // Broken <img> is replaced by the brand wordmark (common.appName).
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(await screen.findByText(/CineNetwork/i)).toBeInTheDocument();
    });
});
