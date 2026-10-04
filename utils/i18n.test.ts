import { describe, it, expect } from 'vitest';
import { formatCompactNumber, getPluralCategory, getTranslation, getTranslationList } from './i18n';
import type { TranslationDict } from './i18n';

const dict: TranslationDict = {
    navbar: {
        home: 'Home',
        greeting: 'Hello, {name}! You have {count} messages.',
    },
    time: {
        minutesAgo: {
            one: '{count} minute ago',
            few: '{count} minutes ago',
            many: '{count} minutes ago',
            other: '{count} minutes ago',
        },
    },
    constants: {
        seasons: ['Winter', 'Spring', 'Summer', 'Fall'],
    },
    nested: { deep: { deeper: { value: 'found' } } },
};

describe('getTranslation', () => {
    it('resolves nested keys', () => {
        expect(getTranslation(dict, 'navbar.home')).toBe('Home');
        expect(getTranslation(dict, 'nested.deep.deeper.value')).toBe('found');
    });

    it('returns undefined for missing keys and partial paths', () => {
        expect(getTranslation(dict, 'navbar.missing')).toBeUndefined();
        expect(getTranslation(dict, 'navbar.home.deeper')).toBeUndefined();
        expect(getTranslation(dict, 'does.not.exist.at.all')).toBeUndefined();
    });

    it('interpolates ALL occurrences of a placeholder', () => {
        const value = getTranslation(dict, 'navbar.greeting', { name: 'Ann', count: 3 });
        expect(value).toBe('Hello, Ann! You have 3 messages.');
    });

    it('replaces repeated placeholders (replaceAll, not replace)', () => {
        const repeated: TranslationDict = { msg: '{x} and {x} again' };
        expect(getTranslation(repeated, 'msg', { x: 1 })).toBe('1 and 1 again');
    });

    describe('pluralisation', () => {
        it('selects Russian categories correctly', () => {
            const plural = (n: number) =>
                getTranslation(dict, 'time.minutesAgo', { count: n }, 'ru');
            // Category picks the form, then {count} is interpolated.
            expect(plural(1)).toBe('1 minute ago'); // one
            expect(plural(2)).toBe('2 minutes ago'); // few
            expect(plural(5)).toBe('5 minutes ago'); // many
        });

        it('handles Russian exceptions 11-14', () => {
            expect(getPluralCategory(11, 'ru')).toBe('many');
            expect(getPluralCategory(12, 'ru')).toBe('many');
            expect(getPluralCategory(14, 'ru')).toBe('many');
            expect(getPluralCategory(21, 'ru')).toBe('one');
            expect(getPluralCategory(22, 'ru')).toBe('few');
            expect(getPluralCategory(25, 'ru')).toBe('many');
            expect(getPluralCategory(101, 'ru')).toBe('one');
        });

        it('handles English categories', () => {
            expect(getPluralCategory(1, 'en')).toBe('one');
            expect(getPluralCategory(0, 'en')).toBe('other');
            expect(getPluralCategory(42, 'en')).toBe('other');
        });
    });

    it('does not treat a nested dictionary as a string', () => {
        expect(getTranslation(dict, 'navbar')).toBeUndefined();
    });
});

describe('getTranslationList', () => {
    it('returns array values', () => {
        expect(getTranslationList(dict, 'constants.seasons')).toEqual([
            'Winter',
            'Spring',
            'Summer',
            'Fall',
        ]);
    });

    it('wraps a plain string into a list', () => {
        expect(getTranslationList(dict, 'navbar.home')).toEqual(['Home']);
    });

    it('returns [] for missing keys', () => {
        expect(getTranslationList(dict, 'missing.key')).toEqual([]);
    });
});

describe('formatCompactNumber', () => {
    it('formats compact numbers per locale', () => {
        expect(formatCompactNumber(1500, 'en')).toMatch(/1\.5K/i);
        expect(formatCompactNumber(1500, 'ru')).toContain('1,5');
    });
});
