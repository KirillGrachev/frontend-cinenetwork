
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Review, SimpleComment } from '../types';

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
            [animeId]: [review, ...(state.reviews[animeId] || [])],
          },
        })),

      addComment: (resourceId, comment) =>
        set((state) => ({
          comments: {
            ...state.comments,
            [resourceId]: [comment, ...(state.comments[resourceId] || [])],
          },
        })),
    }),
    {
      name: 'cine-network-interactions',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
