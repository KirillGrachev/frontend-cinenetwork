import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ru } from './ru';
import { en } from './en';
import { getTranslation } from '../utils/i18n';
import type { TranslationDict } from '../utils/i18n';

/**
 * Static scanner for translation keys.
 *
 * Walks the source tree and extracts every *literal* `t('a.b.c')` /
 * `tList('a.b.c')` call, then asserts the key resolves in BOTH dictionaries.
 * Dynamic keys (template literals, variables) are not matchable statically
 * and are intentionally skipped.
 *
 * This catches the most common i18n regression — a renamed/typo'd key that
 * silently renders as "media.anime.detalis" in production.
 */

const ROOT = join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', 'dist', 'coverage', '.git', 'locales', 'tests']);
const SOURCE_EXT = /\.(ts|tsx)$/;

function walk(dir: string, files: string[] = []): string[] {
    for (const entry of readdirSync(dir)) {
        if (SKIP_DIRS.has(entry)) continue;
        const full = join(dir, entry);
        const stat = statSync(full);
        if (stat.isDirectory()) {
            walk(full, files);
        } else if (SOURCE_EXT.test(entry) && !entry.includes('.test.')) {
            files.push(full);
        }
    }
    return files;
}

const KEY_PATTERN = /\bt(?:List)?\(\s*'([a-zA-Z0-9_.-]+)'/g;

function resolveExists(dict: TranslationDict, path: string): boolean {
    // A key is "used" if it resolves to a string, a plural-forms object or a list.
    return getTranslation(dict, path) !== undefined || getList(dict, path);
}

function getList(dict: TranslationDict, path: string): boolean {
    const value = path.split('.').reduce<unknown>((acc, part) => {
        if (acc === null || acc === undefined || typeof acc !== 'object') return undefined;
        return (acc as Record<string, unknown>)[part];
    }, dict);
    return Array.isArray(value) || (typeof value === 'object' && value !== null);
}

describe('translation keys used in source', () => {
    const usages = new Map<string, string[]>();

    for (const file of walk(ROOT)) {
        const content = readFileSync(file, 'utf8');
        for (const match of content.matchAll(KEY_PATTERN)) {
            const key = match[1];
            const rel = relative(ROOT, file);
            usages.set(key, [...(usages.get(key) ?? []), rel]);
        }
    }

    it('finds a meaningful number of literal keys', () => {
        expect(usages.size).toBeGreaterThan(200);
    });

    it('every literal key resolves in the RU dictionary', () => {
        const missing = [...usages.entries()]
            .filter(([key]) => !resolveExists(ru as unknown as TranslationDict, key))
            .map(([key, files]) => `${key} (${files[0]})`);
        expect(missing, `Missing RU keys:\n${missing.join('\n')}`).toEqual([]);
    });

    it('every literal key resolves in the EN dictionary', () => {
        const missing = [...usages.entries()]
            .filter(([key]) => !resolveExists(en as unknown as TranslationDict, key))
            .map(([key, files]) => `${key} (${files[0]})`);
        expect(missing, `Missing EN keys:\n${missing.join('\n')}`).toEqual([]);
    });
});
