import type {
    IAuthDataProvider,
    IAnimeDataProvider,
    INewsDataProvider,
    ICollectionDataProvider,
    IUserDataProvider,
    IAdminDataProvider,
    IStatusDataProvider,
    INotificationDataProvider,
} from './types';
import { hashString, seededRandom } from '../../utils/random';
import {
    CHARACTER_POOL,
    COMMENT_POOL,
    MODERATORS,
    REVIEW_POOL,
    TICKET_POOL,
    VOICE_ACTOR_POOL,
    mockIp,
    pickFrom,
    pickNickname,
} from '../../data/mock/content';
import { resolveTranslationKey } from '../../locales/registry';
import type { AnimeGenre } from '../../types/enums';
import {
    ActivityType,
    AdminPeriod,
    AnimeType,
    CommentStatus,
    CuratorRole,
    FlagReason,
    ServiceStatus,
    TransactionStatus,
    Trend,
    UserRole,
    UserStatus,
} from '../../types/enums';
import type {
    ActivityLogItem,
    AuthCredentials,
    AuthSession,
    AdminStats,
    AdminSection,
    Anime,
    AnimeDetails,
    BannerItem,
    CharacterDetails,
    Collection,
    Comment,
    Curator,
    Incident,
    LogEntry,
    NewsItem,
    Notification,
    SearchFilters,
    ServiceGroup,
    StatMetric,
    TopContent,
    Transaction,
    UserProfileData,
    UserSettings,
    AdminUser,
} from '../../types';

/** Simulated network latency so loading states behave like the real thing. */
const fakeDelay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Deterministic PRNG helpers live in utils/random — mock data must be stable between calls.

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
        const { FULL_CATALOG, MOCK_VOICEOVERS, MOCK_COMMENTS } =
            await import('../../data/mock/anime');
        const baseAnime = FULL_CATALOG.find((a) => a.id === id) ?? FULL_CATALOG[0];

        /**
         * «Кадры» серий собираются из локальных обложек каталога
         * (детерминированно для каждого тайтла). Внешний placehold.co
         * с текстовыми заглушками «Frame N» ломал продуктовую концепцию
         * страницы и требовал сетевой доступ.
         */
        const shotRandom = seededRandom(hashString(`screens_${id}`));
        const screenshots: string[] = [baseAnime.coverUrl];
        for (let i = 0; i < 11; i++) {
            const donor = FULL_CATALOG[Math.floor(shotRandom() * FULL_CATALOG.length)];
            screenshots.push(donor.coverUrl);
        }

        /** Персонажи уникальны для каждого тайтла (циклический пул из 16 имён). */
        const charRandom = seededRandom(hashString(`chars_${id}`));
        const charCount = 8 + Math.floor(charRandom() * 5);
        const startIdx = Math.floor(charRandom() * CHARACTER_POOL.length);

        return {
            ...baseAnime,
            originalTitle: baseAnime.title,
            status: 'released',
            duration: '23',
            source: 'manga',
            ageRating: '16+',
            episodesCount: 12,
            screenshots,
            voiceovers: MOCK_VOICEOVERS,
            comments: MOCK_COMMENTS,
            characters: Array.from({ length: charCount }, (_, i) => {
                const source = CHARACTER_POOL[(startIdx + i) % CHARACTER_POOL.length];
                return {
                    id: i + 1,
                    name: source.name,
                    role: i < 3 ? ('Main' as const) : ('Supporting' as const),
                    imageUrl: '',
                };
            }),
            episodesList: Array.from({ length: 8 }, (_, i) => ({
                id: i + 1,
                number: i + 1,
                title: `Episode ${i + 1}`,
                image: baseAnime.coverUrl,
                duration: '24 min',
                airDate: new Date(Date.UTC(2023, 0, 1 + i * 7)).toISOString().slice(0, 10),
            })),
            similar: FULL_CATALOG.filter((a) => a.id !== baseAnime.id).slice(0, 4),
        };
    }

    async getCharacterDetails(id: number): Promise<CharacterDetails | undefined> {
        await fakeDelay(400);
        const { FULL_CATALOG } = await import('../../data/mock/anime');
        const character = CHARACTER_POOL[id % CHARACTER_POOL.length];
        const vaRandom = seededRandom(hashString(`va_${id}`));
        const vaStart = Math.floor(vaRandom() * VOICE_ACTOR_POOL.length);
        const vaJa = VOICE_ACTOR_POOL[vaStart % VOICE_ACTOR_POOL.length];
        const vaEn = VOICE_ACTOR_POOL[(vaStart + 4) % VOICE_ACTOR_POOL.length];

        return {
            id,
            name: character.name,
            originalName: character.originalName,
            description: character.description,
            role: 'Main',
            imageUrl: '',
            // Фильмография: детерминированные 2-3 тайтла каталога.
            anime: Array.from(
                { length: 2 + (id % 2) },
                (_, i) => FULL_CATALOG[(id + i * 3) % FULL_CATALOG.length],
            ),
            voiceActors: [
                { id: 1, name: vaJa.name, language: vaJa.language, imageUrl: '' },
                { id: 2, name: vaEn.name, language: vaEn.language, imageUrl: '' },
            ],
        };
    }

    async getStudioAnime(studioName: string): Promise<Anime[]> {
        await fakeDelay(500);
        const { FULL_CATALOG } = await import('../../data/mock/anime');
        return FULL_CATALOG.filter((a) => a.studio?.toLowerCase() === studioName.toLowerCase());
    }

    async search(query: string, filters?: SearchFilters): Promise<Anime[]> {
        await fakeDelay(400);
        const { FULL_CATALOG } = await import('../../data/mock/anime');
        const lowerCaseQuery = query.toLowerCase().trim();

        return FULL_CATALOG.filter((anime) => {
            const matchesQuery =
                !lowerCaseQuery ||
                anime.title.toLowerCase().includes(lowerCaseQuery) ||
                (anime.description && anime.description.toLowerCase().includes(lowerCaseQuery));

            if (!matchesQuery) return false;

            if (filters?.genre) {
                const genre = filters.genre as AnimeGenre;
                if (!anime.genres.includes(genre)) return false;
            }
            if (filters?.year && String(anime.year) !== filters.year) return false;
            if (filters?.studio && anime.studio !== filters.studio) return false;

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
        return NEWS_ITEMS.find((item) => item.id === id);
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
        return COLLECTIONS.find((c) => c.id === id);
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
        const roles: CuratorRole[] = [
            CuratorRole.Admin,
            CuratorRole.Moderator,
            CuratorRole.Contributor,
            CuratorRole.Contributor,
            CuratorRole.Contributor,
        ];
        const count = (id % 5) + 3;
        const random = seededRandom(id * 31 + 7);

        return Array.from({ length: count }, (_, i) => ({
            id: 1000 + i + id * 10,
            username: pickNickname(`curator_${id}_${i}`),
            role: roles[i % roles.length],
            contributions: Math.floor(random() * 50) + 5,
            joinDate: '2025-11-15',
        }));
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

        if (id !== undefined && String(id) !== '1' && String(id) !== 'me') {
            const random = seededRandom(Number(id) || 1);
            return {
                ...MOCK_PROFILE,
                id,
                username: `User_${id}`,
                bio: `Привет! Я пользователь #${id}. Обожаю аниме и коллекционирование.`,
                level: Math.floor(random() * 50) + 1,
                avatarUrl: undefined,
                collections: MOCK_PROFILE.collections.slice(0, 2),
                friends: MOCK_PROFILE.friends.slice(0, 3),
            };
        }

        return MOCK_PROFILE;
    }
}

export class MockNotificationProvider implements INotificationDataProvider {
    async getNotifications(): Promise<Notification[]> {
        await fakeDelay(500);
        const now = Date.now();
        return [
            {
                id: 101,
                title: 'Система',
                description: 'Добро пожаловать в CineNetwork! Настройте свой профиль.',
                time: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
                isRead: true,
                type: 'system',
            },
            {
                id: 102,
                title: 'Новый эпизод',
                description: 'Вышла 12 серия "Магическая битва"',
                time: new Date(now - 1000 * 60 * 30).toISOString(),
                isRead: false,
                type: 'release',
                image: '/assets/jujutsu-kaisen/poster.jpeg',
                link: '/watch/1?ep=12',
            },
            {
                id: 103,
                title: 'NarutoFan99',
                description: 'Понравился ваш комментарий к "Человек-бензопила"',
                time: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
                isRead: false,
                type: 'like',
                link: '/anime/9?tab=comments',
            },
            {
                id: 104,
                title: 'Технические работы',
                description: 'Серверы будут перезагружены через 10 минут.',
                time: new Date(now).toISOString(),
                isRead: false,
                type: 'system',
            },
        ];
    }
}

export class MockAdminProvider implements IAdminDataProvider {
    async getStats(period: AdminPeriod): Promise<AdminStats> {
        await fakeDelay(600);
        const now = Date.now();

        const metrics: StatMetric[] = [
            {
                id: 'users',
                label: 'admin.metrics.totalUsers',
                value: 14205,
                change: '+12%',
                trend: Trend.Up,
                icon: 'fa-solid fa-user-group',
                color: 'text-blue-400',
            },
            {
                id: 'active',
                label: 'admin.metrics.activeNow',
                value: 843,
                change: '+5%',
                trend: Trend.Up,
                icon: 'fa-solid fa-bolt',
                color: 'text-green-400',
            },
            {
                id: 'views',
                label: 'admin.metrics.totalViews',
                value: 1200000,
                change: '-0.8%',
                trend: Trend.Down,
                icon: 'fa-regular fa-eye',
                color: 'text-purple-400',
            },
        ];

        const periodScale: Record<AdminPeriod, number> = {
            [AdminPeriod.Day24]: 1,
            [AdminPeriod.Day7]: 1.8,
            [AdminPeriod.Day30]: 3.2,
        };
        const baseTraffic = [30, 50, 45, 60, 55, 75, 70, 80, 90, 85, 95, 100];
        const trafficHistory = baseTraffic.map((v) =>
            Math.min(100, Math.round(v * periodScale[period] * 0.6 + v * 0.4)),
        );

        const contentDistribution = [
            { label: 'genres.action', value: 35, color: '#3b82f6' },
            { label: 'genres.fantasy', value: 25, color: '#8b5cf6' },
            { label: 'genres.drama', value: 20, color: '#ec4899' },
            { label: 'genres.comedy', value: 10, color: '#f59e0b' },
            { label: 'common.ui.more', value: 10, color: '#6b7280' },
        ];

        /**
         * Платежи в валюте сервиса (RUB — продукт ориентирован на RU-аудиторию;
         * прежние «$59.99» ломали концепцию), с реалистичными никами и ISO-датами.
         */
        const transactions: Transaction[] = [
            {
                id: 'TX-9821',
                user: pickNickname('tx_9821'),
                plan: 'admin.transactions.plans.yearly',
                amount: '3 990 ₽',
                status: TransactionStatus.Completed,
                date: new Date(now - 12 * 60_000).toISOString(),
            },
            {
                id: 'TX-9822',
                user: pickNickname('tx_9822'),
                plan: 'admin.transactions.plans.monthly',
                amount: '399 ₽',
                status: TransactionStatus.Completed,
                date: new Date(now - 47 * 60_000).toISOString(),
            },
            {
                id: 'TX-9823',
                user: pickNickname('tx_9823'),
                plan: 'admin.transactions.plans.monthly',
                amount: '399 ₽',
                status: TransactionStatus.Pending,
                date: new Date(now - 2 * 3600_000).toISOString(),
            },
            {
                id: 'TX-9824',
                user: pickNickname('tx_9824'),
                plan: 'admin.transactions.plans.yearly',
                amount: '3 990 ₽',
                status: TransactionStatus.Completed,
                date: new Date(now - 5 * 3600_000).toISOString(),
            },
        ];

        const { FULL_CATALOG } = await import('../../data/mock/anime');
        const topContent: TopContent[] = FULL_CATALOG.map((anime) => {
            const random = seededRandom(anime.id * 101);
            return {
                id: anime.id,
                title: anime.title,
                views: Math.floor(random() * 50000) + 10000,
                rating: anime.rating,
                image: anime.thumbnailUrl,
                type: anime.type ?? AnimeType.TV,
            };
        })
            .sort((a, b) => b.views - a.views)
            .slice(0, 20);

        /**
         * Состояние контент-платформы (медиатека / кодирование / CDN /
         * сессии просмотра) вместо голой серверной телеметрии — это то, чем
         * реально управляет оператор аниме-сервиса. Инфраструктурные детали
         * живут на публичной странице /status.
         */
        const platformStats = { media: 72, encoding: 38, cdn: 84, streams: 57 };

        const activityLog: ActivityLogItem[] = [
            {
                id: 1,
                action: 'admin.activityLog.actions.subscription',
                user: pickNickname('act_1'),
                time: new Date(now - 6 * 60_000).toISOString(),
                type: ActivityType.Success,
            },
            {
                id: 2,
                action: 'admin.activityLog.actions.register',
                user: pickNickname('act_2'),
                time: new Date(now - 25 * 60_000).toISOString(),
                type: ActivityType.Info,
            },
            {
                id: 3,
                action: 'admin.activityLog.actions.error',
                user: 'encoder-bot',
                time: new Date(now - 2 * 3600_000).toISOString(),
                type: ActivityType.Warning,
            },
            {
                id: 4,
                action: 'admin.activityLog.actions.report',
                user: pickNickname('act_4'),
                time: new Date(now - 3 * 3600_000).toISOString(),
                type: ActivityType.Info,
            },
            {
                id: 5,
                action: 'admin.activityLog.actions.ban',
                user: MODERATORS[0],
                time: new Date(now - 6 * 3600_000).toISOString(),
                type: ActivityType.Warning,
            },
        ];

        return {
            metrics,
            trafficHistory,
            contentDistribution,
            transactions,
            topContent,
            platformStats,
            activityLog,
        };
    }

    async getUsers(): Promise<AdminUser[]> {
        await fakeDelay(600);
        return Array.from({ length: 500 }, (_, i) => {
            const isBanned = i % 15 === 0;
            let role = UserRole.User;
            if (i === 0 || i === 10) role = UserRole.Admin;
            else if (i % 8 === 0) role = UserRole.Moderator;

            const nickname = pickNickname(`user_${i}`);
            return {
                id: `usr_${i}`,
                username: i < 25 ? nickname : `${nickname}${100 + i}`,
                email: `${nickname.toLowerCase().replace(/[^a-z0-9]/g, '')}${100 + i}@example.com`,
                avatarUrl: null,
                role,
                status: isBanned ? UserStatus.Banned : UserStatus.Active,
                joinDate: new Date(Date.now() - i * 86400000 * 0.5).toISOString(),
            };
        });
    }

    async getComments(section: AdminSection): Promise<Comment[]> {
        await fakeDelay(500);
        const { FULL_CATALOG } = await import('../../data/mock/anime');
        const now = Date.now();

        return Array.from({ length: 100 }, (_, i) => {
            const anime = FULL_CATALOG[i % FULL_CATALOG.length];
            const base = {
                id: `cmt_${section}_${i}`,
                userId: `usr_${i % 50}`,
                username: pickNickname(`cmt_${section}_${i}`),
                avatar: null,
                animeTitle: resolveTranslationKey(anime.title),
                episode: (i % 12) + 1,
                time: new Date(now - i * 3600_000).toISOString(),
                status: i % 3 === 0 ? CommentStatus.Pending : CommentStatus.Approved,
                flagReason:
                    i % 3 === 0
                        ? pickFrom(
                              [FlagReason.Spam, FlagReason.Offensive, FlagReason.Spoiler],
                              `flag_${i}`,
                          )
                        : null,
                reportsCount: (i % 5) + 1,
            };

            if (section === 'tickets') {
                return {
                    ...base,
                    content: pickFrom(TICKET_POOL, `ticket_${i}`),
                    type: 'ticket' as const,
                };
            }
            if (section === 'reviews') {
                const review = REVIEW_POOL[i % REVIEW_POOL.length];
                return {
                    ...base,
                    content: review.text,
                    rating: review.rating,
                    type: 'review' as const,
                };
            }
            return {
                ...base,
                content: pickFrom(COMMENT_POOL, `comment_${i}`),
                type: 'comment' as const,
            };
        });
    }

    async getActivityLogs(): Promise<LogEntry[]> {
        await fakeDelay(500);
        const now = Date.now();

        /**
         * Action/description — ключи словарей (переводятся в хуке), время —
         * ISO (форматируется formatRelativeTime). Прежние «Processed item #N»,
         * «Admin_1» и несуществующий ключ actions.delete показывали в UI
         * технический scaffolding и сырые ключи.
         */
        const entryTypes = [
            {
                action: 'admin.activityLog.actions.register',
                description: 'admin.activityLog.descriptions.userCreatedAccount',
                type: ActivityType.Info,
            },
            {
                action: 'admin.activityLog.actions.subscription',
                description: 'admin.activityLog.descriptions.purchasedMonthly',
                type: ActivityType.Success,
            },
            {
                action: 'admin.activityLog.actions.report',
                description: 'admin.activityLog.descriptions.flaggedComment',
                type: ActivityType.Warning,
            },
            {
                action: 'admin.activityLog.actions.error',
                description: 'admin.activityLog.descriptions.encodingError',
                type: ActivityType.Warning,
            },
            {
                action: 'admin.activityLog.actions.ban',
                description: 'admin.activityLog.descriptions.bannedUserForSpam',
                type: ActivityType.Info,
            },
        ];

        return Array.from({ length: 300 }, (_, i) => {
            const entry = entryTypes[i % entryTypes.length];
            return {
                id: 1000 + i,
                action: entry.action,
                description: entry.description,
                user: i % 7 === 0 ? MODERATORS[i % MODERATORS.length] : pickNickname(`log_${i}`),
                time: new Date(now - i * 300_000).toISOString(),
                type: entry.type,
                ip: mockIp(`log_${i}`),
            };
        });
    }
}

export class MockAuthProvider implements IAuthDataProvider {
    async login(_credentials: AuthCredentials): Promise<AuthSession> {
        // The mock accepts any credentials; a real backend validates them.
        await fakeDelay(400);
        const { MOCK_PROFILE } = await import('../../data/mock/user');
        return {
            token: `mock-session-${Date.now().toString(36)}`,
            user: MOCK_PROFILE,
        };
    }

    async logout(): Promise<void> {
        await fakeDelay(100);
    }

    async getCurrentUser(): Promise<UserProfileData> {
        await fakeDelay(200);
        const { MOCK_PROFILE } = await import('../../data/mock/user');
        return MOCK_PROFILE;
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
                updatedAt: new Date(Date.now() - 3600000).toISOString(),
            },
        ];
    }

    async getSystemStatus(): Promise<ServiceGroup[]> {
        await fakeDelay(800);

        /** Deterministic per-service uptime history (stable between refetches). */
        const history = (seed: string, min: number, max: number): number[] => {
            const random = seededRandom(hashString(seed));
            return Array.from({ length: 24 }, () => Math.floor(random() * (max - min + 1) + min));
        };

        return [
            {
                name: 'constants.status.groups.platform',
                services: [
                    {
                        id: 'web',
                        name: 'constants.status.services.web',
                        status: ServiceStatus.Operational,
                        uptime: 99.99,
                        history: history('web', 92, 100),
                    },
                    {
                        id: 'api',
                        name: 'constants.status.services.api',
                        status: ServiceStatus.Operational,
                        uptime: 99.95,
                        latency: 45,
                        history: history('api', 85, 98),
                    },
                    {
                        id: 'auth',
                        name: 'constants.status.services.auth',
                        status: ServiceStatus.Operational,
                        uptime: 100,
                        history: history('auth', 98, 100),
                    },
                ],
            },
            {
                name: 'constants.status.groups.media',
                services: [
                    {
                        id: 'encoding',
                        name: 'constants.status.services.encoding',
                        status: ServiceStatus.Operational,
                        uptime: 100,
                        history: history('encoding', 95, 100),
                    },
                    {
                        id: 'storage',
                        name: 'constants.status.services.storage',
                        status: ServiceStatus.Degraded,
                        uptime: 99.8,
                        history: [...history('storage', 80, 95).slice(0, 22), 45, 60],
                    },
                ],
            },
            {
                name: 'constants.status.groups.databases',
                services: [
                    {
                        id: 'mainDb',
                        name: 'constants.status.services.mainDb',
                        status: ServiceStatus.Operational,
                        uptime: 100,
                        latency: 12,
                        history: history('mainDb', 98, 100),
                    },
                    {
                        id: 'search',
                        name: 'constants.status.services.search',
                        status: ServiceStatus.Operational,
                        uptime: 99.99,
                        latency: 25,
                        history: history('search', 90, 100),
                    },
                ],
            },
        ];
    }
}
