import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useImageLoading } from './useImageLoading';

describe('useImageLoading', () => {
    it('starts unloaded with the initial src', () => {
        const { result } = renderHook(() => useImageLoading('/a.jpg'));
        expect(result.current.isLoaded).toBe(false);
        expect(result.current.hasError).toBe(false);
        expect(result.current.currentSrc).toBe('/a.jpg');
    });

    it('handleLoad marks the image loaded', () => {
        const { result } = renderHook(() => useImageLoading('/a.jpg'));
        act(() => result.current.handleLoad());
        expect(result.current.isLoaded).toBe(true);
    });

    it('handleError marks the error state', () => {
        const { result } = renderHook(() => useImageLoading('/a.jpg'));
        act(() => result.current.handleError());
        expect(result.current.hasError).toBe(true);
        expect(result.current.isLoaded).toBe(false);
    });

    it('resets state when the src prop changes (render-phase adjustment)', () => {
        const { result, rerender } = renderHook(({ src }) => useImageLoading(src), {
            initialProps: { src: '/a.jpg' },
        });

        act(() => result.current.handleLoad());
        expect(result.current.isLoaded).toBe(true);

        rerender({ src: '/b.jpg' });

        expect(result.current.isLoaded).toBe(false);
        expect(result.current.hasError).toBe(false);
        expect(result.current.currentSrc).toBe('/b.jpg');
    });

    it('retry appends a cache-busting parameter', () => {
        const { result } = renderHook(() => useImageLoading('/a.jpg?v=1'));
        act(() => result.current.retry());
        expect(result.current.currentSrc).toMatch(/^\/a\.jpg\?v=1&retry=\d+$/);
        expect(result.current.hasError).toBe(false);
    });
});
