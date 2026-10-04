import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDocumentMeta } from './useDocumentMeta';
import type { DocumentMeta } from './useDocumentMeta';

const baseMeta: DocumentMeta = {
    title: 'Page | CineNetwork',
    description: 'A page description',
    ogType: 'website',
    url: 'https://site.test/page',
    siteName: 'CineNetwork',
    image: 'https://site.test/img.png',
};

const readMeta = (attr: string, value: string) =>
    document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${value}"]`)?.content ?? null;

describe('useDocumentMeta', () => {
    beforeEach(() => {
        document.title = 'Initial';
        document.head
            .querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]')
            .forEach((el) => el.remove());
        document.head
            .querySelectorAll('script[type="application/ld+json"]')
            .forEach((el) => el.remove());
    });

    it('sets the document title and description', () => {
        renderHook(() => useDocumentMeta(baseMeta));
        expect(document.title).toBe('Page | CineNetwork');
        expect(readMeta('name', 'description')).toBe('A page description');
    });

    it('sets Open Graph and Twitter tags', () => {
        renderHook(() => useDocumentMeta(baseMeta));
        expect(readMeta('property', 'og:title')).toBe('Page | CineNetwork');
        expect(readMeta('property', 'og:image')).toBe('https://site.test/img.png');
        expect(readMeta('name', 'twitter:card')).toBe('summary_large_image');
    });

    it('injects JSON-LD structured data', () => {
        renderHook(() =>
            useDocumentMeta({ ...baseMeta, structuredData: { '@type': 'Movie', name: 'X' } }),
        );
        const script = document.head.querySelector('script[type="application/ld+json"]');
        expect(script?.textContent).toBe(JSON.stringify({ '@type': 'Movie', name: 'X' }));
    });

    it('restores the previous title and removes created tags on unmount', () => {
        const { unmount } = renderHook(() =>
            useDocumentMeta({ ...baseMeta, structuredData: { '@type': 'Movie' } }),
        );
        unmount();

        expect(document.title).toBe('Initial');
        expect(document.head.querySelector('script[type="application/ld+json"]')).toBeNull();
        expect(readMeta('property', 'og:title')).toBeNull();
    });

    it('updates tags in place when meta changes', () => {
        const { rerender } = renderHook(({ meta }) => useDocumentMeta(meta), {
            initialProps: { meta: baseMeta },
        });

        rerender({ meta: { ...baseMeta, title: 'Other | CineNetwork' } });

        expect(document.title).toBe('Other | CineNetwork');
        expect(readMeta('property', 'og:title')).toBe('Other | CineNetwork');
        // no duplicate tags
        expect(document.head.querySelectorAll('meta[property="og:title"]')).toHaveLength(1);
    });
});
