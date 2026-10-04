import { useEffect } from 'react';

/**
 * Document metadata manager.
 *
 * Replaces `react-helmet-async` (effectively unmaintained, peer-locked to
 * React ≤18) with ~60 lines of first-party code. Model: exactly one <SEO>
 * is mounted per route; on mount/update the hook upserts its tags and on
 * unmount it restores whatever was there before (pre-existing tags keep
 * their previous content, hook-created tags are removed).
 */

export interface DocumentMeta {
    title: string;
    description: string;
    ogType: string;
    url: string;
    siteName: string;
    image: string;
    /** Serialised by the caller-side memo; compared as a string dep. */
    structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

interface TagSpec {
    selector: string;
    attrs: Record<string, string>;
}

export function useDocumentMeta(meta: DocumentMeta): void {
    const structuredDataJson = meta.structuredData
        ? JSON.stringify(meta.structuredData)
        : undefined;

    useEffect(() => {
        if (typeof document === 'undefined') return;

        const previousTitle = document.title;
        const createdElements: HTMLElement[] = [];
        const restoreAttrs: Array<() => void> = [];

        const upsert = ({ selector, attrs }: TagSpec) => {
            let element = document.head.querySelector<HTMLElement>(selector);
            if (!element) {
                element = document.createElement(selector.startsWith('meta') ? 'meta' : 'title');
                document.head.appendChild(element);
                createdElements.push(element);
            } else {
                // Remember the tag's previous attribute values for cleanup.
                const existing = element;
                const previousValues: Array<[string, string]> = [];
                for (const name of Object.keys(attrs)) {
                    const value = existing.getAttribute(name);
                    if (value !== null) previousValues.push([name, value]);
                }
                restoreAttrs.push(() => {
                    for (const [name, value] of previousValues) {
                        existing.setAttribute(name, value);
                    }
                });
            }
            for (const [name, value] of Object.entries(attrs)) {
                element.setAttribute(name, value);
            }
        };

        document.title = meta.title;

        upsert({
            selector: 'meta[name="description"]',
            attrs: { name: 'description', content: meta.description },
        });

        const ogTags: TagSpec[] = [
            {
                selector: 'meta[property="og:type"]',
                attrs: { property: 'og:type', content: meta.ogType },
            },
            {
                selector: 'meta[property="og:url"]',
                attrs: { property: 'og:url', content: meta.url },
            },
            {
                selector: 'meta[property="og:title"]',
                attrs: { property: 'og:title', content: meta.title },
            },
            {
                selector: 'meta[property="og:description"]',
                attrs: { property: 'og:description', content: meta.description },
            },
            {
                selector: 'meta[property="og:site_name"]',
                attrs: { property: 'og:site_name', content: meta.siteName },
            },
            {
                selector: 'meta[property="og:image"]',
                attrs: { property: 'og:image', content: meta.image },
            },
            {
                selector: 'meta[name="twitter:card"]',
                attrs: { name: 'twitter:card', content: 'summary_large_image' },
            },
            {
                selector: 'meta[name="twitter:title"]',
                attrs: { name: 'twitter:title', content: meta.title },
            },
            {
                selector: 'meta[name="twitter:description"]',
                attrs: { name: 'twitter:description', content: meta.description },
            },
            {
                selector: 'meta[name="twitter:image"]',
                attrs: { name: 'twitter:image', content: meta.image },
            },
        ];
        for (const tag of ogTags) upsert(tag);

        let jsonLdScript: HTMLScriptElement | null = null;
        if (structuredDataJson) {
            jsonLdScript = document.createElement('script');
            jsonLdScript.type = 'application/ld+json';
            jsonLdScript.textContent = structuredDataJson;
            document.head.appendChild(jsonLdScript);
        }

        return () => {
            document.title = previousTitle;
            for (const restore of restoreAttrs) restore();
            for (const element of createdElements) element.remove();
            jsonLdScript?.remove();
        };
    }, [
        meta.title,
        meta.description,
        meta.ogType,
        meta.url,
        meta.siteName,
        meta.image,
        structuredDataJson,
    ]);
}
