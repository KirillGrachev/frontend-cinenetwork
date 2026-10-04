import type { CollectionViewModel, UserProfileData } from '../types';
import type { TFunction } from './i18n';
import { hashString, seededRandom, seededShuffle } from './random';

export type ReviewsFilter = 'all' | 'rating' | 'comment';

export interface ReviewItem {
    id: string;
    type: 'comment' | 'rating';
    title: string;
    date: string;
    content: string | null;
    rating: number | null;
    image: string | null;
}

/**
 * Profile-page list builders.
 *
 * Deterministic by design: every "filler" is derived from a seeded PRNG, so
 * repeated renders/refetches produce the same list. The previous
 * `Math.random()`-based versions re-shuffled content on every call, which
 * made the UI flicker and defeated memoisation.
 */

export function buildFullReviewsList(profile: UserProfileData | null, t: TFunction): ReviewItem[] {
    if (!profile) return [];

    const comments: ReviewItem[] = profile.comments.map((c) => {
        const matchingAnime = profile.ratedAnime.find((r) => r.title === c.animeTitle);
        return {
            id: `c_${c.id}`,
            type: 'comment',
            title: c.animeTitle,
            date: c.date,
            content: c.content,
            rating: null,
            image: matchingAnime ? matchingAnime.image : null,
        };
    });

    const ratings: ReviewItem[] = profile.ratedAnime.map((r, index) => ({
        id: `r_${r.id}`,
        type: 'rating',
        title: r.title,
        date: t('time.hoursAgo', { count: (index + 1) * 5 }),
        content: null,
        rating: r.rating,
        image: r.image,
    }));

    // No synthetic "filler" entries: the previous version padded the list
    // with fake comments/ratings to simulate volume. Real empty/short states
    // are honest to the data and are already styled by the tab components.
    return seededShuffle([...comments, ...ratings], hashString(`reviews_${profile.id}`));
}

export function filterReviewsList(reviews: ReviewItem[], filter: ReviewsFilter): ReviewItem[] {
    if (filter === 'all') return reviews;
    return reviews.filter((item) => item.type === filter);
}

export function buildFullCollectionsList(profile: UserProfileData | null): CollectionViewModel[] {
    if (!profile) return [];

    const mappedCollections: CollectionViewModel[] = profile.collections.map((c) => ({
        ...c,
        previews: c.image ? [c.image, c.image, c.image] : [],
        bgImages: [],
    }));

    return mappedCollections;
}

export interface FriendListItem {
    id: string;
    username: string;
    avatarUrl?: string | null;
    level: number;
}

export function buildFullFriendsList(profile: UserProfileData | null): FriendListItem[] {
    if (!profile) return [];
    return profile.friends;
}

export function buildFullActivityList(profile: UserProfileData | null) {
    if (!profile) return [];
    return profile.recentActivity;
}

export type DynamicsPeriod = '14' | '30' | '90';

export function generateDynamicsData(
    dynamicsPeriod: DynamicsPeriod,
    profileId: string | number = 'me',
    viewingDynamics: number[] = [],
) {
    const days = parseInt(dynamicsPeriod, 10);
    // Real per-day episode counts when the profile provides them; the tail
    // (or the whole range for demo profiles) is filled deterministically.
    const random = seededRandom(hashString(`dynamics_${profileId}_${dynamicsPeriod}`));
    const today = Date.now();
    return Array.from({ length: days }, (_, i) => ({
        date: new Date(today - (days - 1 - i) * 24 * 60 * 60 * 1000),
        value: viewingDynamics[i] ?? Math.floor(random() * 12),
    }));
}
