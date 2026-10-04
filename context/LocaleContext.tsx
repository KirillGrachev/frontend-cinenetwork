import React, { createContext, useState, useContext, useCallback, useEffect, useMemo } from 'react';
import { getTranslation, getTranslationList } from '../utils/i18n';
import type { TFunction, TListFunction, TranslationDict } from '../utils/i18n';
import {
    AVAILABLE_LOCALES,
    DEFAULT_LOCALE,
    isLocale,
    loadLocaleDictionary,
} from '../locales/registry';
import type { Locale } from '../locales/registry';

export type { TFunction, TListFunction, Locale };

const LOCALE_STORAGE_KEY = 'cine-network-locale';

/** Saved choice wins; otherwise infer from the browser language. */
function getInitialLocale(): Locale {
    try {
        const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
        if (isLocale(saved)) return saved;
    } catch {
        // localStorage may be unavailable (private mode) — fall through.
    }
    const browserLang =
        typeof navigator !== 'undefined' ? navigator.language?.toLowerCase() : undefined;
    if (browserLang?.startsWith('ru')) return 'ru';
    if (browserLang?.startsWith('en')) return 'en';
    return DEFAULT_LOCALE;
}

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: TFunction;
    /** For dictionary entries whose value is a string list (e.g. season names). */
    tList: TListFunction;
    availableLocales: readonly Locale[];
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // The original implementation kept the locale in bare `useState('ru')`:
    // the choice was lost on reload and <html lang> drifted from the UI.
    const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
    const [dictionary, setDictionary] = useState<TranslationDict | null>(null);

    /** Load the (code-split) dictionary for the active locale. */
    useEffect(() => {
        let cancelled = false;
        loadLocaleDictionary(locale)
            .then((dict) => {
                if (!cancelled) setDictionary(dict);
            })
            .catch((error: unknown) => {
                // A failed chunk load must not brick the app: keep the
                // previously loaded dictionary (t falls back to keys).
                console.error('[i18n] Failed to load dictionary', locale, error);
            });
        return () => {
            cancelled = true;
        };
    }, [locale]);

    useEffect(() => {
        document.documentElement.lang = locale;
        try {
            localStorage.setItem(LOCALE_STORAGE_KEY, locale);
        } catch {
            // Non-critical: persistence unavailable.
        }
    }, [locale]);

    const setLocale = useCallback((next: Locale) => setLocaleState(next), []);

    const t = useCallback<TFunction>(
        (key, replacements) => {
            if (!dictionary) return key;
            const translation = getTranslation(dictionary, key, replacements, locale);
            if (translation === undefined) {
                if (import.meta.env.DEV) {
                    console.warn(`[i18n] Missing translation key: ${key}`);
                }
                return key;
            }
            return translation;
        },
        [dictionary, locale],
    );

    const tList = useCallback<TListFunction>(
        (key) => (dictionary ? getTranslationList(dictionary, key) : []),
        [dictionary],
    );

    const value = useMemo<LocaleContextType>(
        () => ({
            locale,
            setLocale,
            t,
            tList,
            availableLocales: AVAILABLE_LOCALES,
        }),
        [locale, setLocale, t, tList],
    );

    // Gate children only until the FIRST dictionary arrives (a local chunk —
    // milliseconds). On a language switch the previous dictionary stays
    // mounted until the new one resolves, so the UI never blanks out.
    // NOTE: the splash must be context-free — LoadingSpinner itself calls
    // useLocale and would crash inside its own provider gate.
    if (!dictionary) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-primary">
                <div
                    className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"
                    role="status"
                    aria-label="Loading"
                />
            </div>
        );
    }

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): LocaleContextType => {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
};
