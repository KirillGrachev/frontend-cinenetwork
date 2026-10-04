import { describe, it, expect } from 'vitest';
import {
    buildFullActivityList,
    buildFullCollectionsList,
    buildFullFriendsList,
    buildFullReviewsList,
    filterReviewsList,
    generateDynamicsData,
} from './profileDataUtils';
import type { UserProfileData } from '../types';
import { UserRole, VideoQuality } from '../types';

const t = ((key: string, replacements?: Record<string, string | number>) =>
    replacements?.count !== undefined ? `${key}:${replacements.count}` : key) as never;

function makeProfile(overrides: Partial<UserProfileData> = {}): UserProfileData {
    return {
        id: 7,
        username: 'tester',
        email: 'tester@example.com',
        isPremium: false,
        role: UserRole.User,
        preferences: { autoplay: false, quality: VideoQuality.Q1080p, notifications: false },
        joinDate: '2024-01-01',
        level: 3,
        xp: 100,
        nextLevelXp: 200,
        stats: {
            totalWatchedEpisodes: 10,
            totalTitles: 2,
            daysWatched: 1,
            commentsCount: 1,
            reviewsCount: 1,
            averageScore: 8,
        },
        viewingDynamics: [],
        achievements: [],
        recentActivity: [
            { id: 'a1', type: 'watched', title: 'Ep 1', timestamp: '2024-01-02' },
            { id: 'a2', type: 'rated', title: 'Some Anime', timestamp: '2024-01-03' },
        ],
        friends: [{ id: 'f1', username: 'friend', level: 5 }],
        collections: [{ id: 1, title: 'My List', count: 3, image: '/img.png', color: 'blue' }],
        ratedAnime: [{ id: 11, title: 'mock.anime.title', image: '/a.png', rating: 9 }],
        comments: [
            { id: 21, animeTitle: 'mock.anime.title', content: 'Nice!', date: '2024-01-04' },
        ],
        ...overrides,
    };
}

describe('buildFullReviewsList', () => {
    it('merges comments and ratings and matches images by title', () => {
        const list = buildFullReviewsList(makeProfile(), t);
        expect(list).toHaveLength(2);

        const comment = list.find((i) => i.type === 'comment');
        expect(comment?.content).toBe('Nice!');
        expect(comment?.image).toBe('/a.png'); // resolved from ratedAnime by title

        const rating = list.find((i) => i.type === 'rating');
        expect(rating?.rating).toBe(9);
    });

    it('contains NO synthetic filler entries', () => {
        const list = buildFullReviewsList(makeProfile(), t);
        expect(list.some((i) => i.id.startsWith('filler_'))).toBe(false);
    });

    it('is deterministic between calls (stable order for the same profile)', () => {
        const profile = makeProfile();
        expect(buildFullReviewsList(profile, t)).toEqual(buildFullReviewsList(profile, t));
    });

    it('returns [] for a null profile', () => {
        expect(buildFullReviewsList(null, t)).toEqual([]);
    });
});

describe('filterReviewsList', () => {
    const items = [
        {
            id: '1',
            type: 'comment' as const,
            title: 'a',
            date: 'd',
            content: 'c',
            rating: null,
            image: null,
        },
        {
            id: '2',
            type: 'rating' as const,
            title: 'b',
            date: 'd',
            content: null,
            rating: 8,
            image: null,
        },
    ];

    it('filters by type and passes "all" through', () => {
        expect(filterReviewsList(items, 'all')).toHaveLength(2);
        expect(filterReviewsList(items, 'comment')).toHaveLength(1);
        expect(filterReviewsList(items, 'rating')[0].id).toBe('2');
    });
});

describe('buildFullCollectionsList', () => {
    it('maps collections to view models with previews', () => {
        const list = buildFullCollectionsList(makeProfile());
        expect(list).toHaveLength(1);
        expect(list[0].previews).toEqual(['/img.png', '/img.png', '/img.png']);
        expect(list[0].bgImages).toEqual([]);
    });

    it('does not pad with mock collections any more', () => {
        expect(buildFullCollectionsList(makeProfile())).toHaveLength(1);
    });
});

describe('buildFullFriendsList', () => {
    it('returns the real friends without generated padding', () => {
        const friends = buildFullFriendsList(makeProfile());
        expect(friends).toHaveLength(1);
        expect(friends.some((f) => f.id.startsWith('gen_friend_'))).toBe(false);
    });
});

describe('buildFullActivityList', () => {
    it('returns the real activity feed without duplication', () => {
        expect(buildFullActivityList(makeProfile())).toHaveLength(2);
    });
});

describe('generateDynamicsData', () => {
    it('uses real per-day counts when the profile provides them', () => {
        const data = generateDynamicsData('14', 7, [1, 2, 3]);
        expect(data).toHaveLength(14);
        expect(data[0].value).toBe(1);
        expect(data[2].value).toBe(3);
    });

    it('is deterministic for the same seed', () => {
        expect(generateDynamicsData('30', 7)).toEqual(generateDynamicsData('30', 7));
    });

    it('produces the requested period length with sensible dates', () => {
        const data = generateDynamicsData('90', 'x');
        expect(data).toHaveLength(90);
        expect(data[89].date.getTime()).toBeGreaterThan(data[0].date.getTime());
        for (const point of data) {
            expect(point.value).toBeGreaterThanOrEqual(0);
            expect(point.value).toBeLessThan(12);
        }
    });
});
