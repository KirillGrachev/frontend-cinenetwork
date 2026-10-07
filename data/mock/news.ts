import { NewsItem, ContentType } from '../../types';

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 1,
    title: "mock.news1.title",
    excerpt: "mock.news1.excerpt",
    date: "2026-02-15", /** Changed to ISO format */
    readTime: "mock.news1.readTime",
    tags: ["mock.newsTags.devlog", "mock.newsTags.frontend", "mock.newsTags.announcement"],
    isFeatured: true,
    /** Keys in 'toc' must match keys used in 'Heading' content blocks for linking to work */
    toc: [
        "mock.news1.toc.tech",
        "mock.news1.toc.design",
        "mock.news1.toc.community",
        "mock.news1.toc.roadmap",
        "mock.news1.toc.conclusion"
    ],
    contentBlocks: [
        { type: ContentType.Paragraph, content: "mock.news1.content.intro1" },
        { type: ContentType.Paragraph, content: "mock.news1.content.intro2" },
        
        { type: ContentType.Heading, content: "mock.news1.toc.tech" }, /** Using TOC key for header ensures ID match */
        { type: ContentType.Paragraph, content: "mock.news1.content.p_tech_1" },
        { type: ContentType.Paragraph, content: "mock.news1.content.p_tech_2" },

        { type: ContentType.Heading, content: "mock.news1.toc.design" },
        { type: ContentType.Paragraph, content: "mock.news1.content.p_design_1" },
        { type: ContentType.Paragraph, content: "mock.news1.content.p_design_2" },

        { type: ContentType.Heading, content: "mock.news1.toc.community" },
        { type: ContentType.Paragraph, content: "mock.news1.content.p_community_1" },
        { type: ContentType.Paragraph, content: "mock.news1.content.p_community_2" },

        { type: ContentType.Heading, content: "mock.news1.toc.roadmap" },
        { type: ContentType.Paragraph, content: "mock.news1.content.p_roadmap_1" },
        { type: ContentType.Paragraph, content: "mock.news1.content.p_roadmap_list_1" },
        { type: ContentType.Paragraph, content: "mock.news1.content.p_roadmap_list_2" },
        { type: ContentType.Paragraph, content: "mock.news1.content.p_roadmap_list_3" },
        { type: ContentType.Paragraph, content: "mock.news1.content.p_roadmap_list_4" },

        { type: ContentType.Heading, content: "mock.news1.toc.conclusion" },
        { type: ContentType.Paragraph, content: "mock.news1.content.p_conclusion" },
    ]
  }
];