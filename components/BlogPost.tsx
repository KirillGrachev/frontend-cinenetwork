import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { AppRoute } from '../types';
import Button from './ui/Button';
import { useLocale } from '../context/LocaleContext';
import { useBlogPostLogic } from '../hooks/useBlogPostLogic';
import { useScrollSpy } from '../hooks/useScrollSpy';
import SEO from './SEO';

/** Subcomponents */
import BlogPostHeader from './blog/BlogPostHeader';
import BlogPostContent from './blog/BlogPostContent';
import BlogPostSidebar from './blog/BlogPostSidebar';
import BlogPostFooter from './blog/BlogPostFooter';
import BlogPostSkeleton from './skeletons/BlogPostSkeleton';

const BlogPost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const postId = Number(id);

    const { t } = useLocale();
    const { state, actions } = useBlogPostLogic(postId);
    const { post, isLoading, error, linkCopied, tocItems, isClickingRef } = state;

    /** Use scroll spy hook independently for separation of concerns */
    const { activeId, setActiveId } = useScrollSpy(
        tocItems.map((i) => i.id),
        150,
        isClickingRef,
    );

    const handleTocClick = (sectionId: string) => {
        // 1. Visually update sidebar immediately
        setActiveId(sectionId);
        // 2. Perform smooth scroll
        actions.scrollToSection(sectionId);
    };

    const onBack = () => navigate(AppRoute.News);

    if (isLoading && !post) {
        return <BlogPostSkeleton />;
    }

    if (error || !post) {
        return (
            <div className="min-h-screen pt-32 pb-20 text-center flex flex-col items-center justify-center">
                <h1 className="text-2xl text-gray-400 mb-2">{t('blogPost.notFound')}</h1>
                <p className="text-red-500 text-sm mb-4">{error?.message}</p>
                <Button onClick={onBack} className="mt-4">
                    {t('blogPost.backToNews')}
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 animate-fade-in">
            <SEO title={t(post.title)} description={t(post.excerpt)} type="article" />

            <div className="container mx-auto px-4 md:px-8">
                {/** Back Button */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon="fa-solid fa-arrow-left"
                        onClick={onBack}
                        className="pl-0 hover:!bg-transparent hover:text-white"
                    >
                        {t('blogPost.backToNews')}
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
                    {/** Main Content Area */}
                    <div className="flex-1 max-w-3xl">
                        <BlogPostHeader post={post} />

                        <BlogPostContent
                            blocks={post.contentBlocks}
                            getSectionId={actions.getSectionId}
                        />

                        <BlogPostFooter onCopyLink={actions.copyLink} linkCopied={linkCopied} />
                    </div>

                    {/** Sidebar / TOC */}
                    <BlogPostSidebar
                        tocItems={tocItems}
                        activeId={activeId}
                        onItemClick={handleTocClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
