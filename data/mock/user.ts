
import { UserSettings, VideoQuality, UserProfileData } from '../../types';

export const MOCK_USER: UserSettings = {
  id: 1,
  username: "CineUser_01",
  email: "user@cinenetwork.space",
  avatarUrl: "",
  isPremium: true,
  preferences: {
    autoplay: true,
    quality: VideoQuality.Q4k,
    notifications: true,  }
};

export const MOCK_PROFILE: UserProfileData = {
    ...MOCK_USER,
    joinDate: "15.11.2023",
    coverUrl: "/assets/jujutsu-kaisen/cover.jpeg", // Mock cover
    level: 12,
    xp: 2450,
    nextLevelXp: 3000,
    bio: "Люблю сёнэны и глубокие драмы. Вечно в поиске идеального тайтла.",
    stats: {
        totalWatchedEpisodes: 1243,
        totalTitles: 89,
        daysWatched: 24.5,
        commentsCount: 156,
        reviewsCount: 12,
        averageScore: 8.4
    },
    viewingDynamics: [2, 5, 0, 8, 4, 3, 10, 1, 0, 2, 6, 7, 12, 4], // Last 14 days episodes count
    achievements: [
        { id: '1', icon: 'fa-solid fa-fire', title: 'Марафонец', description: 'Посмотрел 10 серий подряд', unlockedAt: '12.01.2024', color: 'text-orange-500' },
        { id: '2', icon: 'fa-solid fa-comments', title: 'Критик', description: 'Оставил 100 комментариев', unlockedAt: '05.02.2024', color: 'text-blue-400' },
        { id: '3', icon: 'fa-solid fa-crown', title: 'Премиум', description: 'Поддержал проект', unlockedAt: '15.11.2023', color: 'text-yellow-400' }
    ],
    friends: [
        { id: 'f1', username: 'NarutoFan99', level: 45 },
        { id: 'f2', username: 'Sakura_Chan', level: 12 },
        { id: 'f3', username: 'LoidForger', level: 23 },
        { id: 'f4', username: 'Anya_Pianist', level: 8 },
        { id: 'f5', username: 'GojoSatoru', level: 99 },
    ],
    recentActivity: [
        { 
            id: 'a1', 
            type: 'watched', 
            title: 'mock.jujutsuKaisen.title', 
            timestamp: '2 часа назад', 
            meta: 'Эпизод 14',
            image: '/assets/jujutsu-kaisen/poster.jpeg',
            link: '/anime/1'
        },
        { 
            id: 'a2', 
            type: 'rated', 
            title: 'mock.frieren.title', 
            timestamp: '5 часов назад', 
            meta: 'Оценка 10/10',
            image: '/assets/frieren/poster.jpeg',
            link: '/anime/17'
        },
        { 
            id: 'a3', 
            type: 'added_list', 
            title: 'mock.soloLeveling.title', 
            timestamp: '1 день назад', 
            meta: 'В планы',
            image: '/assets/solo-leveling/poster.jpeg',
            link: '/anime/18'
        },
        { 
            id: 'a4', 
            type: 'commented', 
            title: 'mock.chainsawMan.title', 
            timestamp: '2 дня назад', 
            meta: 'Комментарий к 8 серии',
            image: '/assets/chainsaw-man/poster.jpeg',
            link: '/anime/9'
        },
        { 
            id: 'a5', 
            type: 'watched', 
            title: 'mock.spyXFamily.title', 
            timestamp: '3 дня назад', 
            meta: 'Эпизод 2',
            image: '/assets/spy-x-family/poster.jpeg',
            link: '/anime/11'
        }
    ],
    collections: [
        { id: 101, title: 'Мой Топ 2023', count: 12, image: '/assets/jujutsu-kaisen/poster.jpeg', color: 'blue' },
        { id: 102, title: 'Для просмотра с друзьями', count: 5, image: '/assets/chainsaw-man/poster.jpeg', color: 'red' },
        { id: 103, title: 'Грустные моменты', count: 8, image: '/assets/frieren/poster.jpeg', color: 'purple' }
    ],
    ratedAnime: [
        { id: 17, title: 'mock.frieren.title', image: '/assets/frieren/poster.jpeg', rating: 10 },
        { id: 1, title: 'mock.jujutsuKaisen.title', image: '/assets/jujutsu-kaisen/poster.jpeg', rating: 9 },
        { id: 9, title: 'mock.chainsawMan.title', image: '/assets/chainsaw-man/poster.jpeg', rating: 9 },
        { id: 4, title: 'mock.attackOnTitan.title', image: '/assets/attack-on-titan/poster.jpeg', rating: 10 }
    ],
    comments: [
        { id: 101, animeTitle: 'mock.chainsawMan.title', content: 'Это просто невероятная адаптация! Маппа превзошли сами себя.', date: '2 дня назад' },
        { id: 102, animeTitle: 'mock.frieren.title', content: 'Очень трогательная история, заставляет задуматься о течении времени.', date: '5 дней назад' }
    ]
};
