import { describe, it, expect, beforeEach } from 'vitest';
import { useInteractionStore } from './interactionStore';
import { useSearchStore } from './searchStore';
import { SearchCategory } from '../types';
import type { Review, SimpleComment } from '../types';

const review = (id: number): Review => ({
    id,
    userId: 'u',
    username: 'user',
    rating: 8,
    date: '2026-01-01',
    content: 'ok',
    likes: 0,
});

const comment = (id: number): SimpleComment => ({
    id,
    userId: 'u',
    username: 'user',
    content: 'hi',
    date: '2026-01-01',
});

describe('interactionStore', () => {
    beforeEach(() => {
        useInteractionStore.setState({ reviews: {}, comments: {} });
    });

    it('prepends reviews per anime', () => {
        const { addReview } = useInteractionStore.getState();
        addReview(1, review(1));
        addReview(1, review(2));
        addReview(2, review(3));

        const { reviews } = useInteractionStore.getState();
        expect(reviews[1].map((r) => r.id)).toEqual([2, 1]);
        expect(reviews[2]).toHaveLength(1);
    });

    it('caps reviews per resource at 50', () => {
        const { addReview } = useInteractionStore.getState();
        for (let i = 1; i <= 60; i++) addReview(9, review(i));
        const list = useInteractionStore.getState().reviews[9];
        expect(list).toHaveLength(50);
        expect(list[0].id).toBe(60); // newest kept
    });

    it('caps comments per resource at 100', () => {
        const { addComment } = useInteractionStore.getState();
        for (let i = 1; i <= 130; i++) addComment(9, comment(i));
        expect(useInteractionStore.getState().comments[9]).toHaveLength(100);
    });
});

describe('searchStore', () => {
    beforeEach(() => {
        useSearchStore.setState({
            isSearchOpen: false,
            searchQuery: '',
            searchCategory: SearchCategory.Anime,
            recentSearches: [],
        });
    });

    it('keeps recent searches deduplicated, newest first, max 5', () => {
        const { addRecentSearch } = useSearchStore.getState();
        ['a', 'b', 'c', 'd', 'e', 'f'].forEach(addRecentSearch);
        expect(useSearchStore.getState().recentSearches).toEqual(['f', 'e', 'd', 'c', 'b']);

        addRecentSearch('d');
        expect(useSearchStore.getState().recentSearches).toEqual(['d', 'f', 'e', 'c', 'b']);
    });

    it('ignores blank queries', () => {
        useSearchStore.getState().addRecentSearch('   ');
        expect(useSearchStore.getState().recentSearches).toEqual([]);
    });

    it('toggleSearchOpen flips the flag', () => {
        useSearchStore.getState().toggleSearchOpen();
        expect(useSearchStore.getState().isSearchOpen).toBe(true);
    });

    it('clearRecentSearches empties the list', () => {
        useSearchStore.getState().addRecentSearch('x');
        useSearchStore.getState().clearRecentSearches();
        expect(useSearchStore.getState().recentSearches).toEqual([]);
    });
});
