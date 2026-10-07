import { 
    IAnimeDataProvider, 
    INewsDataProvider, 
    ICollectionDataProvider, 
    IUserDataProvider, 
    IAdminDataProvider,
    IStatusDataProvider
} from './types';
import { 
    Anime, 
    BannerItem, 
    AnimeDetails, 
    CharacterDetails, 
    NewsItem, 
    Collection, 
    Curator, 
    CuratorRole,
    UserSettings, 
    UserProfileData,
    AdminPeriod,
    AdminUser,
    UserRole,
    UserStatus,
    CommentStatus,
    FlagReason,
    AnimeType,
    Incident
} from '../../types';
import { StatMetric, Transaction, TopContent, ActivityLogItem } from '../../hooks/useAdminStats';
import { Comment } from '../../hooks/useAdminComments';
import { LogEntry } from '../../hooks/useActivityLogLogic';

const fakeDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockAnimeProvider implements IAnimeDataProvider {
    async getFeaturedAnime(): Promise<Anime> {
        await fakeDelay(300);
        const { FEATURED_ANIME } = await import('../../data/mock/anime');
        return FEATURED_ANIME;
    }

    async getNewReleases(): Promise<Anime[]> {
        await fakeDelay(500);
        const { NEW_RELEASES } = await import('../../data/mock/anime');
        return NEW_RELEASES;
    }

    async getTrendingAnime(): Promise<Anime[]> {
        await fakeDelay(500);
        const { TRENDING_ANIME } = await import('../../data/mock/anime');
        return TRENDING_ANIME;
    }

    async getFullCatalog(): Promise<Anime[]> {
        await fakeDelay(800);
        const { FULL_CATALOG } = await import('../../data/mock/anime');
        return FULL_CATALOG;
    }

    async getHomeBanners(): Promise<BannerItem[]> {
        await fakeDelay(350);
        const { HOME_BANNERS } = await import('../../data/mock/anime');
        return HOME_BANNERS;
    }

    async getFavorites(): Promise<Anime[]> {
        await fakeDelay(400);
        const { FULL_CATALOG } = await import('../../data/mock/anime');
        return FULL_CATALOG;
    }

    async getAnimeDetails(id: number): Promise<AnimeDetails | undefined> {
        await fakeDelay(600);
        const { FULL_CATALOG, MOCK_VOICEOVERS, MOCK_COMMENTS } = await import('../../data/mock/anime');
        const baseAnime = FULL_CATALOG.find(a => a.id === id) || FULL_CATALOG[0];

        const screenshots: string[] = [
            baseAnime.coverUrl,
            "/assets/spy-x-family/cover.jpeg",
            "/assets/demon-slayer/cover.jpeg",
            "/assets/jujutsu-kaisen/cover.jpeg",
            "/assets/chainsaw-man/cover.jpeg"
        ];

        for (let i = 6; i <= 30; i++) {
            screenshots.push(`https://placehold.co/600x338/1a1a1a/FFF?text=Frame+${i}`);
        }

        return {
            ...baseAnime,
            originalTitle: "Spy x Family Season 2",
            status: 'released',
            duration: "23", 
            source: 'manga',
            ageRating: '16+',
            episodesCount: 12,
            screenshots,
            voiceovers: MOCK_VOICEOVERS,
            comments: MOCK_COMMENTS,
            characters: [
                { id: 1, name: 'Loid Forger', role: 'Main', imageUrl: '' },
                { id: 2, name: 'Anya Forger', role: 'Main', imageUrl: '' },
                { id: 3, name: 'Yor Forger', role: 'Main', imageUrl: '' },
                { id: 4, name: 'Bond Forger', role: 'Supporting', imageUrl: '' },
                { id: 5, name: 'Yuri Briar', role: 'Supporting', imageUrl: '' },
                { id: 6, name: 'Fiona Frost', role: 'Supporting', imageUrl: '' },
                { id: 7, name: 'Franky Franklin', role: 'Supporting', imageUrl: '' },
                { id: 8, name: 'Sylvia Sherwood', role: 'Supporting', imageUrl: '' },
                { id: 9, name: 'Henry Henderson', role: 'Supporting', imageUrl: '' },
                { id: 10, name: 'Damian Desmond', role: 'Supporting', imageUrl: '' },
                { id: 11, name: 'Becky Blackbell', role: 'Supporting', imageUrl: '' },
                { id: 12, name: 'Emile Elman', role: 'Supporting', imageUrl: '' },
            ],
            staff: [
                { id: 1, name: 'Kazuhiro Furuhashi', role: 'Director' },
                { id: 2, name: 'Tatsuya Endo', role: 'Original Creator' },
            ],
            videos: [
                { id: 1, title: 'Trailer 1', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', type: 'PV' }
            ],
            episodesList: [
                { id: 1, number: 1, title: 'Episode 1', image: baseAnime.coverUrl, duration: '24 min', airDate: '2023-01-01' },
                { id: 2, number: 2, title: 'Episode 2', image: baseAnime.coverUrl, duration: '24 min', airDate: '2023-01-08' },
                { id: 3, number: 3, title: 'Episode 3', image: baseAnime.coverUrl, duration: '24 min', airDate: '2023-01-15' },
                { id: 4, number: 4, title: 'Episode 4', image: baseAnime.coverUrl, duration: '24 min', airDate: '2023-01-22' },
                { id: 5, number: 5, title: 'Episode 5', image: baseAnime.coverUrl, duration: '24 min', airDate: '2023-01-29' },
                { id: 6, number: 6, title: 'Episode 6', image: baseAnime.coverUrl, duration: '24 min', airDate: '2023-02-05' },
                { id: 7, number: 7, title: 'Episode 7', image: baseAnime.coverUrl, duration: '24 min', airDate: '2023-02-12' },
                { id: 8, number: 8, title: 'Episode 8', image: baseAnime.coverUrl, duration: '24 min', airDate: '2023-02-19' },
            ],
            similars: FULL_CATALOG.slice(0, 4)
        };
    }

    async getCharacterDetails(id: number): Promise<CharacterDetails | undefined> {
        await fakeDelay(400);
        const { FULL_CATALOG } = await import('../../data/mock/anime');
        return {
            id,
            name: 'Loid Forger',
            japaneseName: 'ロイド・フォージャー',
            description: 'A master spy code-named "Twilight" working for WISE.',
            role: 'Main Character',
            anime: FULL_CATALOG[0]
        };
    }

    async getStudioAnime(studioName: string): Promise<Anime[]> {
        await fakeDelay(500);
        const { FULL_CATALOG } = await import('../../data/mock/anime');
        return FULL_CATALOG.filter(a => a.studio?.toLowerCase() === studioName.toLowerCase());
    }

    async search(query: string, filters?: any): Promise<Anime[]> {
        await fakeDelay(400);
        const { FULL_CATALOG } = await import('../../data/mock/anime');
        const lowerCaseQuery = query.toLowerCase().trim();

        return FULL_CATALOG.filter(anime => {
            const matchesQuery = !lowerCaseQuery || 
                anime.title.toLowerCase().includes(lowerCaseQuery) ||
                (anime.description && anime.description.toLowerCase().includes(lowerCaseQuery));

            if (!matchesQuery) return false;

            if (filters) {
                if (filters.genre && !anime.genres.includes(filters.genre as any)) return false;
                if (filters.year && String(anime.year) !== filters.year) return false;
                if (filters.studio && anime.studio !== filters.studio) return false;
            }

            return true;
        });
    }
}

export class MockNewsProvider implements INewsDataProvider {
    async getNewsItems(): Promise<NewsItem[]> {
        await fakeDelay(400);
        const { NEWS_ITEMS } = await import('../../data/mock/news');
        return NEWS_ITEMS;
    }

    async getNewsItemById(id: number): Promise<NewsItem | undefined> {
        const { NEWS_ITEMS } = await import('../../data/mock/news');
        return NEWS_ITEMS.find(item => item.id === id);
    }
}

export class MockCollectionProvider implements ICollectionDataProvider {
    async getCollections(): Promise<Collection[]> {
        await fakeDelay(600);
        const { COLLECTIONS } = await import('../../data/mock/collections');
        return COLLECTIONS;
    }

    async getCollectionById(id: number): Promise<Collection | undefined> {
        await fakeDelay(300);
        const { COLLECTIONS } = await import('../../data/mock/collections');
        return COLLECTIONS.find(c => c.id === id);
    }

    async getAnimeByCollectionId(id: number): Promise<Anime[]> {
        await fakeDelay(500);
        const { FULL_CATALOG } = await import('../../data/mock/anime');
        return FULL_CATALOG.filter((_, index) => {
            const seed = id * 7 + 3;
            return (index + seed) % 4 === 0 || (index + seed) % 5 === 0;
        }).slice(0, 15);
    }

    async getCuratorsByCollectionId(id: number): Promise<Curator[]> {
        await fakeDelay(400);
        const roles: CuratorRole[] = [CuratorRole.Admin, CuratorRole.Moderator, CuratorRole.Contributor, CuratorRole.Contributor, CuratorRole.Contributor];
        const count = (id % 5) + 3;
        
        const curators: Curator[] = [];
        for(let i = 0; i < count; i++) {
            curators.push({
                id: 1000 + i + (id * 10),
                username: `Curator_${(id * 10) + i}`,
                role: roles[i % roles.length],
                contributions: Math.floor(Math.random() * 50) + 5,
                joinDate: '2025-11-15'
            });
        }
        return curators;
    }
}

export class MockUserProvider implements IUserDataProvider {
    async getUserSettings(): Promise<UserSettings> {
        await fakeDelay(400);
        const { MOCK_USER } = await import('../../data/mock/user');
        return MOCK_USER;
    }

    async getUserProfile(id?: string | number): Promise<UserProfileData> {
        await fakeDelay(500);
        const { MOCK_PROFILE } = await import('../../data/mock/user');
        
        if (id && String(id) !== '1') {
            return {
                ...MOCK_PROFILE,
                id: id,
                username: `User_${id}`,
                bio: `Привет! Я пользователь #${id}. Обожаю аниме и коллекционирование.`,
                level: Math.floor(Math.random() * 50) + 1,
                avatarUrl: undefined,
                collections: MOCK_PROFILE.collections.slice(0, 2),
                friends: MOCK_PROFILE.friends.slice(0, 3)
            };
        }

        return MOCK_PROFILE;
    }
}

export class MockAdminProvider implements IAdminDataProvider {
    async getStats(period: AdminPeriod) {
        await fakeDelay(600);
        
        const metrics: StatMetric[] = [
            { id: 'users', label: 'admin.metrics.totalUsers', value: 14205, change: '+12%', trend: 'up' as any, icon: 'fa-solid fa-user-group', color: 'text-blue-400' },
            { id: 'active', label: 'admin.metrics.activeNow', value: 843, change: '+5%', trend: 'up' as any, icon: 'fa-solid fa-bolt', color: 'text-green-400' },
            { id: 'views', label: 'admin.metrics.totalViews', value: 1200000, change: '-0.8%', trend: 'down' as any, icon: 'fa-regular fa-eye', color: 'text-purple-400' },
        ];

        const trafficHistory = [30, 50, 45, 60, 55, 75, 70, 80, 90, 85, 95, 100];

        const contentDistribution = [
            { label: 'genres.action', value: 35, color: '#3b82f6' },
            { label: 'genres.fantasy', value: 25, color: '#8b5cf6' },
            { label: 'genres.drama', value: 20, color: '#ec4899' },
            { label: 'genres.comedy', value: 10, color: '#f59e0b' },
            { label: 'common.ui.more', value: 10, color: '#6b7280' },
        ];

        const transactions: Transaction[] = [
            { id: 'TX-9821', user: 'Alex_99', plan: 'admin.transactions.plans.yearly', amount: '$59.99', status: 'completed' as any, date: 'time.minutesAgo' },
            { id: 'TX-9822', user: 'SarahConnor', plan: 'admin.transactions.plans.monthly', amount: '$5.99', status: 'completed' as any, date: 'time.minutesAgo' },
            { id: 'TX-9823', user: 'JohnDoe', plan: 'admin.transactions.plans.monthly', amount: '$5.99', status: 'pending' as any, date: 'time.hoursAgo' },
            { id: 'TX-9824', user: 'KiraYoshikage', plan: 'admin.transactions.plans.yearly', amount: '$59.99', status: 'completed' as any, date: 'time.hoursAgo' },
        ];

        const { FULL_CATALOG } = await import('../../data/mock/anime');
        const topContent: TopContent[] = FULL_CATALOG.map((anime) => ({
            id: anime.id,
            title: anime.title,
            views: Math.floor(Math.random() * 50000) + 10000,
            rating: anime.rating,
            image: anime.thumbnailUrl,
            type: anime.type || AnimeType.TV
        })).sort((a, b) => b.views - a.views).slice(0, 20);

        const serverStats = { cpu: 42, ram: 65, storage: 78, net: 340 };

        const activityLog: ActivityLogItem[] = [
            { id: 1, action: 'admin.activityLog.actions.subscription', user: 'Alex_99', time: 'time.minutesAgo', type: 'success' as any },
            { id: 2, action: 'admin.activityLog.actions.register', user: 'KiraYoshikage', time: 'time.minutesAgo', type: 'info' as any },
            { id: 3, action: 'admin.activityLog.actions.error', user: 'System', time: 'time.hoursAgo', type: 'warning' as any },
            { id: 4, action: 'admin.activityLog.actions.register', user: 'NarutoFan', time: 'time.hoursAgo', type: 'info' as any },
            { id: 5, action: 'admin.activityLog.actions.report', user: 'User_123', time: 'time.hoursAgo', type: 'warning' as any },
        ];

        return { metrics, trafficHistory, contentDistribution, transactions, topContent, serverStats, activityLog };
    }

    async getUsers(): Promise<AdminUser[]> {
        await fakeDelay(600);
        return Array.from({ length: 500 }).map((_, i) => {
            const isBanned = i % 15 === 0;
            let role = UserRole.User;
            if (i === 0 || i === 10) role = UserRole.Admin;
            else if (i % 8 === 0) role = UserRole.Moderator;

            return {
                id: `usr_${i}`,
                username: `User_${i + 100}`,
                email: `user${i + 100}@example.com`,
                avatarUrl: null,
                role: role,
                status: isBanned ? UserStatus.Banned : UserStatus.Active,
                createdAt: new Date(Date.now() - (i * 86400000 * 0.5)).toISOString()
            };
        });
    }

    async getComments(): Promise<Comment[]> {
        await fakeDelay(500);
        return Array.from({ length: 100 }).map((_, i) => ({
            id: `cmt_${i}`,
            author: `User_${i + 10}`,
            authorAvatar: null,
            targetTitle: `Anime Title #${(i % 10) + 1}`,
            targetId: (i % 10) + 1,
            text: `Это тестовый комментарий #${i + 1} для проверки системы модерации административной панели.`,
            createdAt: '2026-03-01T12:00:00Z',
            reportsCount: (i % 5) + 1,
            flagReason: FlagReason.Spam,
            status: CommentStatus.Pending
        }));
    }

    async getActivityLogs(): Promise<LogEntry[]> {
        await fakeDelay(500);
        return Array.from({ length: 300 }).map((_, i) => ({
            id: `log_${i}`,
            timestamp: new Date(Date.now() - (i * 300000)).toISOString(),
            actor: `Admin_${(i % 3) + 1}`,
            action: i % 2 === 0 ? 'USER_BAN' : 'COMMENT_DELETE',
            details: `Processed item #${i}`,
            ip: '192.168.1.1'
        }));
    }
}

export class MockStatusProvider implements IStatusDataProvider {
    async getIncidents(): Promise<Incident[]> {
        await fakeDelay(400);
        return [
            {
                id: 'INC-101',
                title: 'Задержка трансляций у провайдера',
                status: 'Investigating',
                updatedAt: new Date(Date.now() - 3600000).toISOString()
            }
        ];
    }
}
