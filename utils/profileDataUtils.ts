import { UserProfile, CollectionViewModel } from '../types';

export interface ReviewItem {
    id: string;
    type: string;
    title: string;
    date: string;
    content: string | null;
    rating: number | null;
    image: string | null;
}

/**
 * Builds full reviews/comments/ratings list with fillers if needed.
 */
export const buildFullReviewsList = (
    profile: UserProfile | null, 
    t: (key: string, options?: Record<string, any>) => string
): ReviewItem[] => {
    if (!profile) return [];

    const comments: ReviewItem[] = profile.comments.map(c => {
        const matchingAnime = profile.ratedAnime.find(r => r.title === c.animeTitle);
        return {
            id: `c_${c.id}`,
            type: 'comment',
            title: c.animeTitle,
            date: c.date,
            content: c.content,
            rating: null,
            image: matchingAnime ? matchingAnime.image : null
        };
    });

    const ratings: ReviewItem[] = profile.ratedAnime.map((r, index) => ({
        id: `r_${r.id}`,
        type: 'rating',
        title: r.title,
        date: t('time.hoursAgo', { count: (index + 1) * 5 }),
        content: null,
        rating: r.rating,
        image: r.image
    }));

    const currentCount = comments.length + ratings.length;
    const fillersCount = Math.max(0, 16 - currentCount); 
    
    const fillers: ReviewItem[] = Array.from({ length: fillersCount }).map((_, i) => ({
         id: `filler_${i}`,
         type: i % 2 === 0 ? 'comment' : 'rating',
         title: i % 2 === 0 ? 'mock.chainsawMan.title' : 'mock.jujutsuKaisen.title',
         date: t('time.hoursAgo', { count: 20 + i }),
         content: i % 2 === 0 ? 'Круто!' : null,
         rating: i % 2 !== 0 ? 8 : null,
         image: '/assets/jujutsu-kaisen/poster.jpeg'
    }));

    return [...comments, ...ratings, ...fillers].sort(() => 0.5 - Math.random());
};

/**
 * Filters review items by type ('all' | 'rating' | 'comment')
 */
export const filterReviewsList = (
    reviews: ReviewItem[], 
    filter: 'all' | 'rating' | 'comment'
): ReviewItem[] => {
    if (filter === 'all') return reviews;
    return reviews.filter(item => item.type === filter);
};

/**
 * Builds collections list ensuring required minimum items.
 */
export const buildFullCollectionsList = (
    profile: UserProfile | null,
    t: (key: string) => string
): CollectionViewModel[] => {
    if (!profile) return [];
    
    const mappedCollections: CollectionViewModel[] = profile.collections.map(c => ({
        ...c,
        previews: c.image ? [c.image, c.image, c.image] : [],
        bgImages: [] 
    }));

    if (mappedCollections.length < 12) {
         const needed = 12 - mappedCollections.length;
         const extras = Array.from({ length: needed }).map((_, i) => ({
             ...mappedCollections[0] || { title: 'Mock Collection', count: 0, image: '', color: 'blue' },
             id: 9000 + i,
             title: `${t('media.collections.collection')} ${i + 1}`,
             previews: mappedCollections[0]?.previews || []
         }));
         return [...mappedCollections, ...extras];
    }
    return mappedCollections;
};

/**
 * Builds friends list ensuring required minimum items.
 */
export const buildFullFriendsList = (profile: UserProfile | null) => {
    if (!profile) return [];
    if (profile.friends.length < 29) {
        const needed = 29 - profile.friends.length;
        const extra = Array.from({ length: needed }).map((_, i) => ({
            id: `gen_friend_${i}`,
            username: `Friend_${i}`,
            avatarUrl: null,
            level: Math.floor(Math.random() * 50)
        }));
        return [...profile.friends, ...extra];
    }
    return profile.friends;
};

/**
 * Builds activity feed list.
 */
export const buildFullActivityList = (profile: UserProfile | null) => {
    if (!profile) return [];
    const base = [...profile.recentActivity];
    let extended = [...base];
    for (let i = 0; i < 5; i++) {
        extended = [...extended, ...base.map(a => ({ ...a, id: a.id + '_gen_' + i }))];
    }
    return extended;
};

/**
 * Generates dynamics period chart data.
 */
export const generateDynamicsData = (dynamicsPeriod: '14' | '30' | '90') => {
    const days = parseInt(dynamicsPeriod);
    return Array.from({ length: days }).map((_, i) => ({
        date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000),
        value: Math.floor(Math.random() * 12)
    }));
};
