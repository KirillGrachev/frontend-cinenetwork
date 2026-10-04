import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

/**
 * Global test setup.
 * happy-dom lacks a few browser APIs the component tree touches; the stubs
 * below are minimal no-op implementations (tests that need behaviour
 * override them individually).
 */

if (!globalThis.ResizeObserver) {
    class ResizeObserverStub {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

if (!globalThis.IntersectionObserver) {
    class IntersectionObserverStub {
        readonly root = null;
        readonly rootMargin = '';
        readonly thresholds: readonly number[] = [];
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords(): IntersectionObserverEntry[] {
            return [];
        }
    }
    globalThis.IntersectionObserver =
        IntersectionObserverStub as unknown as typeof IntersectionObserver;
}

if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
}

if (!window.scrollTo) {
    window.scrollTo = (() => {}) as unknown as typeof window.scrollTo;
}

// LocalStorage/sessionStorage must not leak state between tests.
afterEach(() => {
    cleanup();
    try {
        localStorage.clear();
        sessionStorage.clear();
    } catch {
        // environment without storage — nothing to clear
    }
    vi.restoreAllMocks();
});
