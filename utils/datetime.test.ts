import { describe, it, expect } from 'vitest';
import { formatRelativeTime } from './datetime';

describe('formatRelativeTime', () => {
    it('formats a recent timestamp with a suffix', () => {
        const now = new Date().toISOString();
        const result = formatRelativeTime(now, 'en');
        expect(result).toContain('ago');
    });

    it('formats in Russian when locale is ru', () => {
        const oneHourAgo = new Date(Date.now() - 3600_000).toISOString();
        const result = formatRelativeTime(oneHourAgo, 'ru');
        expect(result).toMatch(/назад/);
    });

    it('never throws on invalid input — returns the raw string', () => {
        expect(formatRelativeTime('not-a-date', 'en')).toBe('not-a-date');
        expect(formatRelativeTime('', 'ru')).toBe('');
    });
});
