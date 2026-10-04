import React from 'react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import { useLocale } from '../../context/LocaleContext';

const BlogPostSkeleton: React.FC = () => {
    const { t } = useLocale();

    return (
        <div className="min-h-screen pt-32 pb-20 page-reveal">
            <div className="container mx-auto px-4 md:px-8">
                {/** Back Button Skeleton */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon="fa-solid fa-arrow-left"
                        disabled
                        className="pl-0 opacity-50"
                    >
                        {t('blogPost.backToNews')}
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
                    {/** Main Content Area Skeleton */}
                    <div className="flex-1 max-w-3xl w-full">
                        <header className="mb-10">
                            {/* Meta items */}
                            <div className="flex items-center gap-3 mb-6">
                                <Skeleton className="h-8 w-24 rounded-lg" />
                                <Skeleton className="h-8 w-24 rounded-lg" />
                            </div>

                            {/* Title */}
                            <div className="space-y-3 mb-8">
                                <Skeleton className="h-12 w-full rounded-xl" />
                                <Skeleton className="h-12 w-3/4 rounded-xl" />
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-10">
                                <Skeleton className="h-7 w-20 rounded-lg" />
                                <Skeleton className="h-7 w-24 rounded-lg" />
                                <Skeleton className="h-7 w-16 rounded-lg" />
                            </div>

                            {/* Divider */}
                            <div className="h-px w-full bg-border-medium mb-10"></div>

                            {/* Content Blocks Skeletons */}
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-full rounded" />
                                    <Skeleton className="h-4 w-full rounded" />
                                    <Skeleton className="h-4 w-5/6 rounded" />
                                </div>
                                <Skeleton className="h-64 w-full rounded-2xl" />
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-full rounded" />
                                    <Skeleton className="h-4 w-11/12 rounded" />
                                    <Skeleton className="h-4 w-4/5 rounded" />
                                </div>
                                <div className="space-y-3">
                                    <Skeleton className="h-8 w-1/2 rounded-lg mb-4" />
                                    <Skeleton className="h-4 w-full rounded" />
                                    <Skeleton className="h-4 w-3/4 rounded" />
                                </div>
                            </div>
                        </header>
                    </div>

                    {/** Sidebar / TOC Skeleton */}
                    <div className="hidden lg:block w-72 flex-shrink-0 sticky top-32">
                        <Skeleton className="h-4 w-32 rounded mb-6" />
                        <div className="relative border-l border-border-medium ml-4 space-y-4 py-2">
                            <Skeleton className="h-4 w-4/5 rounded ml-4" />
                            <Skeleton className="h-4 w-3/4 rounded ml-4" />
                            <Skeleton className="h-4 w-5/6 rounded ml-4" />
                            <Skeleton className="h-4 w-2/3 rounded ml-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPostSkeleton;
