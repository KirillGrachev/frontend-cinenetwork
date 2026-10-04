import { ContentType } from '../../types';
import type { NewsItem } from '../../types';

/**
 * Новостная лента сервиса — анонсы, релизы озвучек, статистика просмотров
 * и продуктовые обновления. Прежняя «новость» была девлогом о разработке
 * платформы (технологии/дизайн/roadmap) и ломала продуктовую концепцию:
 * в новостях аниме-сервиса пользователи ждут новости об аниме.
 *
 * Ключи 'toc' обязаны совпадать с ключами, используемыми в Heading-блоках, —
 * по ним строится якорная навигация статьи (getSectionId).
 */

export const NEWS_ITEMS: NewsItem[] = [
    {
        id: 1,
        title: 'mock.news1.title',
        excerpt: 'mock.news1.excerpt',
        date: '2026-03-20',
        readTime: 'mock.news1.readTime',
        tags: ['mock.newsTags.announcement', 'mock.newsTags.anime'],
        isFeatured: true,
        toc: ['mock.news1.toc.details', 'mock.news1.toc.story', 'mock.news1.toc.dates'],
        contentBlocks: [
            { type: ContentType.Paragraph, content: 'mock.news1.content.intro1' },
            { type: ContentType.Heading, content: 'mock.news1.toc.details' },
            { type: ContentType.Paragraph, content: 'mock.news1.content.p_details_1' },
            { type: ContentType.Heading, content: 'mock.news1.toc.story' },
            { type: ContentType.Paragraph, content: 'mock.news1.content.p_story_1' },
            { type: ContentType.Paragraph, content: 'mock.news1.content.p_story_2' },
            { type: ContentType.Heading, content: 'mock.news1.toc.dates' },
            { type: ContentType.Paragraph, content: 'mock.news1.content.p_dates_1' },
        ],
    },
    {
        id: 2,
        title: 'mock.news2.title',
        excerpt: 'mock.news2.excerpt',
        date: '2026-03-14',
        readTime: 'mock.news2.readTime',
        tags: ['mock.newsTags.season', 'mock.newsTags.releases'],
        isFeatured: false,
        toc: ['mock.news2.toc.highlights', 'mock.news2.toc.where'],
        contentBlocks: [
            { type: ContentType.Paragraph, content: 'mock.news2.content.intro1' },
            { type: ContentType.Heading, content: 'mock.news2.toc.highlights' },
            { type: ContentType.Paragraph, content: 'mock.news2.content.p_highlights_1' },
            { type: ContentType.Paragraph, content: 'mock.news2.content.p_highlights_2' },
            { type: ContentType.Heading, content: 'mock.news2.toc.where' },
            { type: ContentType.Paragraph, content: 'mock.news2.content.p_where_1' },
        ],
    },
    {
        id: 3,
        title: 'mock.news3.title',
        excerpt: 'mock.news3.excerpt',
        date: '2026-03-06',
        readTime: 'mock.news3.readTime',
        tags: ['mock.newsTags.releases', 'mock.newsTags.voiceover'],
        isFeatured: false,
        toc: ['mock.news3.toc.voiceovers', 'mock.news3.toc.schedule'],
        contentBlocks: [
            { type: ContentType.Paragraph, content: 'mock.news3.content.intro1' },
            { type: ContentType.Heading, content: 'mock.news3.toc.voiceovers' },
            { type: ContentType.Paragraph, content: 'mock.news3.content.p_voiceovers_1' },
            { type: ContentType.Heading, content: 'mock.news3.toc.schedule' },
            { type: ContentType.Paragraph, content: 'mock.news3.content.p_schedule_1' },
        ],
    },
    {
        id: 4,
        title: 'mock.news4.title',
        excerpt: 'mock.news4.excerpt',
        date: '2026-02-28',
        readTime: 'mock.news4.readTime',
        tags: ['mock.newsTags.statistics', 'mock.newsTags.anime'],
        isFeatured: false,
        toc: ['mock.news4.toc.top', 'mock.news4.toc.trends'],
        contentBlocks: [
            { type: ContentType.Paragraph, content: 'mock.news4.content.intro1' },
            { type: ContentType.Heading, content: 'mock.news4.toc.top' },
            { type: ContentType.Paragraph, content: 'mock.news4.content.p_top_1' },
            { type: ContentType.Paragraph, content: 'mock.news4.content.p_top_2' },
            { type: ContentType.Heading, content: 'mock.news4.toc.trends' },
            { type: ContentType.Paragraph, content: 'mock.news4.content.p_trends_1' },
        ],
    },
    {
        id: 5,
        title: 'mock.news5.title',
        excerpt: 'mock.news5.excerpt',
        date: '2026-02-15',
        readTime: 'mock.news5.readTime',
        tags: ['mock.newsTags.player', 'mock.newsTags.announcement'],
        isFeatured: false,
        toc: ['mock.news5.toc.features', 'mock.news5.toc.howto'],
        contentBlocks: [
            { type: ContentType.Paragraph, content: 'mock.news5.content.intro1' },
            { type: ContentType.Heading, content: 'mock.news5.toc.features' },
            { type: ContentType.Paragraph, content: 'mock.news5.content.p_features_1' },
            { type: ContentType.Paragraph, content: 'mock.news5.content.p_features_2' },
            { type: ContentType.Heading, content: 'mock.news5.toc.howto' },
            { type: ContentType.Paragraph, content: 'mock.news5.content.p_howto_1' },
        ],
    },
];
