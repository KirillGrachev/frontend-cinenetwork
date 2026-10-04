/**
 * Typed i18n helpers.
 *
 * The dictionaries are plain nested objects; values are either strings or
 * plural-form maps ({ one, few, many, other }). Everything is typed — the
 * previous `obj: any` / `: any` returns defeated type checking at every
 * call site of `t()`.
 */

export interface PluralForms {
    one?: string;
    few?: string;
    many?: string;
    other?: string;
}

export type TranslationValue = string | string[] | PluralForms | TranslationDict;

export interface TranslationDict {
    [key: string]: TranslationValue;
}

export type TranslationReplacements = Record<string, string | number>;

/**
 * Resolves an array-valued key (e.g. `constants.seasons`). Some dictionary
 * entries are string lists rather than single strings — the old `t(): any`
 * silently returned arrays from `t()`, which is why this is a separate,
 * explicitly typed function.
 */
export function getTranslationList(dict: TranslationDict, path: string): string[] {
    const value = lookup(dict, path);
    if (Array.isArray(value))
        return value.filter((item): item is string => typeof item === 'string');
    if (typeof value === 'string') return [value];
    return [];
}

/** Signature of the `t()` function exposed by LocaleContext. */
export type TFunction = (key: string, replacements?: TranslationReplacements) => string;

/** Signature of the `tList()` function exposed by LocaleContext. */
export type TListFunction = (key: string) => string[];

/** CLDR-ish plural category for the supported locales. */
export function getPluralCategory(count: number, locale: string): keyof PluralForms {
    if (locale === 'ru') {
        const mod10 = count % 10;
        const mod100 = count % 100;
        if (mod10 === 1 && mod100 !== 11) return 'one';
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'few';
        return 'many';
    }
    return count === 1 ? 'one' : 'other';
}

function lookup(dict: TranslationDict, path: string): TranslationValue | undefined {
    let current: TranslationValue | undefined = dict;
    for (const part of path.split('.')) {
        if (current === undefined || typeof current === 'string' || Array.isArray(current)) {
            return undefined;
        }
        current = (current as TranslationDict)[part];
    }
    return current;
}

function applyReplacements(value: string, replacements: TranslationReplacements): string {
    return Object.entries(replacements).reduce(
        (acc, [key, val]) => acc.replaceAll(`{${key}}`, String(val)),
        value,
    );
}

/**
 * Resolves `path` inside `dict`, applies pluralisation (driven by a numeric
 * `count`/`mins` replacement) and interpolates `{placeholders}`.
 * Returns `undefined` when the key cannot be resolved to a string so the
 * caller can decide on a fallback (usually: render the key itself).
 */
export function getTranslation(
    dict: TranslationDict,
    path: string,
    replacements?: TranslationReplacements,
    locale = 'en',
): string | undefined {
    let value = lookup(dict, path);

    let count: number | undefined;
    if (replacements) {
        if (typeof replacements.count === 'number') count = replacements.count;
        else if (typeof replacements.mins === 'number') count = replacements.mins;
    }

    if (value !== undefined && typeof value === 'object' && !Array.isArray(value)) {
        const forms = value as PluralForms;
        const hasPluralForms =
            forms.one !== undefined ||
            forms.few !== undefined ||
            forms.many !== undefined ||
            forms.other !== undefined;

        if (count !== undefined && hasPluralForms) {
            const category = getPluralCategory(count, locale);
            value = forms[category] ?? forms.other ?? forms.many ?? Object.values(forms)[0];
        }
    }

    if (typeof value !== 'string') return undefined;
    return replacements ? applyReplacements(value, replacements) : value;
}

/** Compact number formatting (1.5k / 1,5 тыс.). */
export function formatCompactNumber(value: number, locale = 'en'): string {
    return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
}
