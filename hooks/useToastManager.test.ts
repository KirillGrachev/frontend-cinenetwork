import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToastManager } from './useToastManager';
import { ToastType } from '../types';

describe('useToastManager', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('shows a toast and auto-removes it after the display + animation window', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useToastManager());

        act(() => {
            result.current.showToast('Saved', ToastType.Success);
        });
        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.hasToasts).toBe(true);

        // 3s display → marked closing
        act(() => {
            vi.advanceTimersByTime(3000);
        });
        expect(result.current.toasts[0].isClosing).toBe(true);

        // +500ms closing animation → removed
        act(() => {
            vi.advanceTimersByTime(500);
        });
        expect(result.current.toasts).toHaveLength(0);
        expect(result.current.hasToasts).toBe(false);
    });

    it('deduplicates identical messages while visible', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useToastManager());

        act(() => {
            result.current.showToast('Same', ToastType.Info);
            result.current.showToast('Same', ToastType.Info);
        });
        expect(result.current.toasts).toHaveLength(1);
    });

    it('caps visible toasts at 3, dropping the oldest', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useToastManager());

        act(() => {
            result.current.showToast('one');
            result.current.showToast('two');
            result.current.showToast('three');
            result.current.showToast('four');
        });

        const messages = result.current.toasts.map((toast) => toast.message);
        expect(messages).toEqual(['two', 'three', 'four']);
    });

    it('removeToast plays the closing animation before removal', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useToastManager());

        act(() => {
            result.current.showToast('bye');
        });
        const id = result.current.toasts[0].id;

        act(() => {
            result.current.removeToast(id);
        });
        expect(result.current.toasts[0].isClosing).toBe(true);

        act(() => {
            vi.advanceTimersByTime(500);
        });
        expect(result.current.toasts).toHaveLength(0);
    });

    it('a removed message can be shown again', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useToastManager());

        act(() => {
            result.current.showToast('repeat');
        });
        const id = result.current.toasts[0].id;
        act(() => {
            result.current.removeToast(id);
            vi.advanceTimersByTime(500);
        });

        act(() => {
            result.current.showToast('repeat');
        });
        expect(result.current.toasts).toHaveLength(1);
    });
});
