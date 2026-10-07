
import React from 'react';
import { NewsItem } from '../../types';
import { useLocale } from '../../context/LocaleContext';

interface BlogPostHeaderProps {
    post: NewsItem;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({ post }) => {
    const { t, locale } = useLocale();
    
    // Format date
    const formattedDate = new Date(post.date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <header className="mb-10">
            <div className="flex items-center gap-3 mb-6">
                {/* CHANGED: leading-none for better centering */}
                <div className="flex items-center gap-2 bg-item-primary px-3 py-1.5 rounded-lg  h-8">
                    <i className="fa-regular fa-calendar text-[10px] text-gray-500 leading-none"></i>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-none">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 bg-item-primary px-3 py-1.5 rounded-lg  h-8">
                    <i className="fa-regular fa-clock text-[10px] text-gray-500 leading-none"></i>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-none">{t(post.readTime)}</span>
                </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight tracking-tight">{t(post.title)}</h1>
            
            <div className="flex flex-wrap gap-2 mb-10">
                {post.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-panel-primary border border-border-medium text-xs font-bold text-gray-400 tracking-wide hover:bg-white/10 hover:text-white transition-colors cursor-default">{t(tag)}</span>
                ))}
            </div>
            
            <div className="h-px w-full bg-border-medium"></div>
        </header>
    );
};

export default BlogPostHeader;
