import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNavbarDesktopLogic } from './useNavbarDesktopLogic';
import { useRef } from 'react';

function setup(isSearchOpen = true, searchQuery = '') {
    return renderHook(
        ({ open, query }: { open: boolean; query: string }) => {
            const ref = useRef<HTMLInputElement>(null);
            return useNavbarDesktopLogic(open, query, ref);
        },
        { initialProps: { open: isSearchOpen, query: searchQuery } },
    );
}

describe('useNavbarDesktopLogic (derived results visibility)', () => {
    it('hides results while the search is closed', () => {
        const { result } = setup(false, 'naruto');
        expect(result.current.state.isResultsVisible).toBe(false);
    });

    it('hides results for an empty query', () => {
        const { result } = setup(true, '   ');
        expect(result.current.state.isResultsVisible).toBe(false);
    });

    it('shows results for a non-empty query when open', () => {
        const { result } = setup(true, 'naruto');
        expect(result.current.state.isResultsVisible).toBe(true);
    });

    it('hides results while the filter menu is open', () => {
        const { result } = setup(true, 'naruto');
        act(() => result.current.actions.setIsFilterMenuOpen(true));
        expect(result.current.state.isResultsVisible).toBe(false);
    });

    it('shows results for active filters even with an empty query', () => {
        const { result } = setup(true, '');
        act(() => result.current.actions.setFilters({ genre: 'action' }));
        expect(result.current.state.isResultsVisible).toBe(true);
    });

    it('closeResults dismisses the current result set only', () => {
        const { result, rerender } = setup(true, 'naruto');

        act(() => result.current.actions.closeResults());
        expect(result.current.state.isResultsVisible).toBe(false);

        // Same query stays dismissed...
        rerender({ open: true, query: 'naruto' });
        expect(result.current.state.isResultsVisible).toBe(false);

        // ...but a NEW query re-opens results automatically.
        rerender({ open: true, query: 'bleach' });
        expect(result.current.state.isResultsVisible).toBe(true);
    });
});
