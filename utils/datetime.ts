import { formatDistanceToNow } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';

/**
 * Relative-time formatting shared by Notifications page and the navbar
 * dropdown (previously duplicated verbatim in both).
 * Never throws: on an invalid date falls back to the raw string.
 */
export function formatRelativeTime(isoTime: string, locale: string): string {
    try {
        return formatDistanceToNow(new Date(isoTime), {
            addSuffix: true,
            locale: locale === 'ru' ? ru : enUS,
        });
    } catch {
        return isoTime;
    }
}
