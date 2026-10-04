/**
 * Local identity generation for optimistic entities (comments, reviews,
 * temp collections, chat messages) created before a backend responds.
 *
 * Isolated here for two reasons:
 *  1. Component bodies must stay pure (React Compiler rule) — reading the
 *     clock belongs in event handlers via this opaque helper.
 *  2. When the real API lands, server-generated ids replace these in one
 *     place.
 */
export function createLocalEntityId(): number {
    return Date.now();
}

export function createLocalEntityIdString(): string {
    return Date.now().toString(36);
}
