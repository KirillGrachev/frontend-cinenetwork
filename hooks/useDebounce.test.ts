import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns the initial value immediately', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useDebounce('start', 300));
        expect(result.current).toBe('start');
    });

    it('delays propagation until the delay elapses', () => {
        vi.useFakeTimers();
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
            initialProps: { value: 'a' },
        });

        rerender({ value: 'b' });
        act(() => {
            vi.advanceTimersByTime(200);
        });
        expect(result.current).toBe('a'); // not yet

        act(() => {
            vi.advanceTimersByTime(120);
        });
        expect(result.current).toBe('b');
    });

    it('restarts the timer on rapid changes (only the last value wins)', () => {
        vi.useFakeTimers();
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
            initialProps: { value: 'a' },
        });

        rerender({ value: 'ab' });
        act(() => {
            vi.advanceTimersByTime(200);
        });
        rerender({ value: 'abc' });
        act(() => {
            vi.advanceTimersByTime(200);
        });
        expect(result.current).toBe('a');

        act(() => {
            vi.advanceTimersByTime(150);
        });
        expect(result.current).toBe('abc');
    });

    it('cleans up pending timers on unmount', () => {
        vi.useFakeTimers();
        const { unmount, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
            initialProps: { value: 'a' },
        });
        rerender({ value: 'b' });
        expect(() => {
            unmount();
            vi.advanceTimersByTime(500);
        }).not.toThrow();
    });
});
