/**
 * Site URL helpers.
 *
 * `window.location` must not be touched at module scope or inside utilities
 * that could run during SSR/prerender — everything goes through this guard.
 */
export function getSiteOrigin(): string {
    return typeof window !== 'undefined' ? window.location.origin : '';
}

export function getSiteUrl(): string {
    return typeof window !== 'undefined' ? window.location.href : '';
}

/** Turns a root-relative path ("/anime/1") into an absolute URL. */
export function toAbsoluteUrl(path: string): string {
    if (path.startsWith('http')) return path;
    return `${getSiteOrigin()}${path}`;
}
