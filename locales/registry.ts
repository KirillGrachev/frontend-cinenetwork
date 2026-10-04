import type { TranslationDict } from '../utils/i18n';
import { getTranslation } from '../utils/i18n';

/**
 * Locale registry.
 *
 * Dictionaries are code-split per locale (`import('./ru')`) instead of being
 * bundled statically into the app chunk — the previous layout shipped BOTH
 * full dictionaries (~164 KB of JS) to every visitor on first paint.
 *
 * The registry also gives non-React code (services doing text search over
 * mock fixtures) access to whatever dictionary is already loaded, without
 * importing the locales module graph statically.
 */

export type Locale = 'ru' | 'en';

export const AVAILABLE_LOCALES: readonly Locale[] = ['ru', 'en'] as const;

export const DEFAULT_LOCALE: Locale = 'ru';

export function isLocale(value: string | null | undefined): value is Locale {
    return (
        value !== null &&
        value !== undefined &&
        (AVAILABLE_LOCALES as readonly string[]).includes(value)
    );
}

const cache = new Map<Locale, TranslationDict>();

/** Loads (once) and caches the dictionary chunk for a locale. */
export async function loadLocaleDictionary(locale: Locale): Promise<TranslationDict> {
    const cached = cache.get(locale);
    if (cached) return cached;

    const dict: TranslationDict =
        locale === 'ru'
            ? ((await import('./ru')).ru as TranslationDict)
            : ((await import('./en')).en as TranslationDict);

    cache.set(locale, dict);
    return dict;
}

export function getCachedDictionary(locale: Locale): TranslationDict | undefined {
    return cache.get(locale);
}

/**
 * Resolves a translation key outside of React (e.g. services matching
 * human-readable text of mock fixtures, which store i18n keys).
 * Uses the Russian dictionary when loaded (canonical for fixtures),
 * otherwise any loaded one; falls back to the raw key.
 */
export function resolveTranslationKey(key: string): string {
    if (!key.includes('.')) return key;
    const dict = cache.get('ru') ?? cache.values().next().value;
    if (!dict) return key;
    return getTranslation(dict, key, undefined, 'ru') ?? key;
}
