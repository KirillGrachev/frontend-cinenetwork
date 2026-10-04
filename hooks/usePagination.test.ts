import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
    it('shows all pages when the list is short', () => {
        const { result } = renderHook(() => usePagination(1, 5));
        expect(result.current).toEqual([1, 2, 3, 4, 5]);
    });

    it('window near the start', () => {
        const { result } = renderHook(() => usePagination(2, 20));
        expect(result.current).toEqual([1, 2, 3, 4, '...', 20]);
    });

    it('window near the end', () => {
        const { result } = renderHook(() => usePagination(19, 20));
        expect(result.current).toEqual([1, '...', 17, 18, 19, 20]);
    });

    it('window in the middle', () => {
        const { result } = renderHook(() => usePagination(10, 20));
        expect(result.current).toEqual([1, '...', 9, 10, 11, '...', 20]);
    });

    it('single page', () => {
        const { result } = renderHook(() => usePagination(1, 1));
        expect(result.current).toEqual([1]);
    });
});
