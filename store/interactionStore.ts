import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Review, SimpleComment } from '../types';

/** Per-resource caps — this store is persisted, so unbounded growth would eat the localStorage quota. */
const MAX_REVIEWS_PER_RESOURCE = 50;
const MAX_COMMENTS_PER_RESOURCE = 100;

interface InteractionState {
    reviews: Record<number, Review[]>;
    comments: Record<number, SimpleComment[]>;

    addReview: (animeId: number, review: Review) => void;
    addComment: (resourceId: number, comment: SimpleComment) => void;
}

export const useInteractionStore = create<InteractionState>()(
    persist(
        (set) => ({
            reviews: {},
            comments: {},

            addReview: (animeId, review) =>
                set((state) => ({
                    reviews: {
                        ...state.reviews,
                        [animeId]: [review, ...(state.reviews[animeId] ?? [])].slice(
                            0,
                            MAX_REVIEWS_PER_RESOURCE,
                        ),
                    },
                })),

            addComment: (resourceId, comment) =>
                set((state) => ({
                    comments: {
                        ...state.comments,
                        [resourceId]: [comment, ...(state.comments[resourceId] ?? [])].slice(
                            0,
                            MAX_COMMENTS_PER_RESOURCE,
                        ),
                    },
                })),
        }),
        {
            name: 'cine-network-interactions',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
