import { describe, it, expect } from 'vitest';
import { ru } from './ru';
import { en } from './en';

/**
 * Dictionary parity: every key present in one locale must exist in the
 * other. A missing key degrades to rendering the raw key path in the UI,
 * which is exactly the class of bug this test prevents.
 */

type Node = string | string[] | { [key: string]: Node };

const PLURAL_CATEGORIES = new Set(['one', 'few', 'many', 'other']);

function isPluralForms(node: Node): boolean {
    return (
        typeof node === 'object' &&
        !Array.isArray(node) &&
        Object.keys(node).length > 0 &&
        Object.keys(node).every((key) => PLURAL_CATEGORIES.has(key))
    );
}

function collectPaths(node: Node, prefix: string, out: Set<string>): void {
    if (typeof node === 'string') {
        out.add(prefix);
        return;
    }
    if (Array.isArray(node)) {
        out.add(prefix); // list-valued key (tList)
        return;
    }
    // Plural-form objects are leaves: RU legitimately has one/few/many while
    // EN has one/other — comparing their sub-keys would be a false positive.
    if (isPluralForms(node)) {
        out.add(prefix);
        return;
    }
    for (const [key, value] of Object.entries(node)) {
        collectPaths(value, prefix ? `${prefix}.${key}` : key, out);
    }
}

function pathsOf(dict: Node): Set<string> {
    const out = new Set<string>();
    collectPaths(dict, '', out);
    return out;
}

describe('locale dictionaries parity', () => {
    const ruPaths = pathsOf(ru as unknown as Node);
    const enPaths = pathsOf(en as unknown as Node);

    it('both dictionaries are non-trivial', () => {
        expect(ruPaths.size).toBeGreaterThan(500);
        expect(enPaths.size).toBeGreaterThan(500);
    });

    it('every RU key exists in EN', () => {
        const missingInEn = [...ruPaths].filter((path) => !enPaths.has(path));
        expect(missingInEn, `Missing in en: ${missingInEn.slice(0, 30).join(', ')}`).toEqual([]);
    });

    it('every EN key exists in RU', () => {
        const missingInRu = [...enPaths].filter((path) => !ruPaths.has(path));
        expect(missingInRu, `Missing in ru: ${missingInRu.slice(0, 30).join(', ')}`).toEqual([]);
    });

    it('list-valued keys have matching types across locales', () => {
        const resolve = (dict: Node, path: string): Node | undefined =>
            path
                .split('.')
                .reduce<Node | undefined>(
                    (acc, part) =>
                        acc !== undefined && typeof acc === 'object' && !Array.isArray(acc)
                            ? (acc as Record<string, Node>)[part]
                            : undefined,
                    dict,
                );

        const mismatched: string[] = [];
        for (const path of ruPaths) {
            const a = resolve(ru as unknown as Node, path);
            const b = resolve(en as unknown as Node, path);
            if (Array.isArray(a) !== Array.isArray(b)) mismatched.push(path);
        }
        expect(mismatched).toEqual([]);
    });
});
