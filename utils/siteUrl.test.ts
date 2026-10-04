import { describe, it, expect } from 'vitest';
import { getSiteOrigin, getSiteUrl, toAbsoluteUrl } from './siteUrl';

describe('siteUrl helpers', () => {
    it('exposes the current origin and href in a browser environment', () => {
        expect(getSiteOrigin()).toBe(window.location.origin);
        expect(getSiteUrl()).toBe(window.location.href);
    });

    it('toAbsoluteUrl leaves absolute URLs untouched', () => {
        expect(toAbsoluteUrl('https://cdn.example/img.png')).toBe('https://cdn.example/img.png');
    });

    it('toAbsoluteUrl prefixes root-relative paths with the origin', () => {
        expect(toAbsoluteUrl('/assets/img.png')).toBe(`${window.location.origin}/assets/img.png`);
    });
});
