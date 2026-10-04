import React from 'react';
import DOMPurify from 'dompurify';
import type { ContentBlock } from '../../types';
import { ContentType } from '../../types';
import { useLocale } from '../../context/LocaleContext';

interface BlogPostContentProps {
    blocks?: ContentBlock[];
    getSectionId: (text: string) => string;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ blocks, getSectionId }) => {
    const { t } = useLocale();

    if (!blocks) return null;

    return (
        <article className="font-sans">
            {blocks.map((block, index) => {
                switch (block.type) {
                    case ContentType.Paragraph:
                        return (
                            <p
                                key={index}
                                className="text-gray-300 text-lg leading-relaxed mb-6"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(t(block.content || '')),
                                }}
                            />
                        );
                    case ContentType.Heading: {
                        const id = getSectionId(t(block.content || ''));
                        return (
                            <h2
                                id={id}
                                key={index}
                                className="text-2xl font-bold text-white mb-4 mt-10 scroll-mt-32"
                            >
                                {t(block.content || '')}
                            </h2>
                        );
                    }
                    default:
                        return null;
                }
            })}
        </article>
    );
};

export default BlogPostContent;
