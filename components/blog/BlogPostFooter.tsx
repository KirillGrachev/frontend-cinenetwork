import React from 'react';
import { useLocale } from '../../context/LocaleContext';

interface BlogPostFooterProps {
    onCopyLink: () => void;
    linkCopied: boolean;
}

const BlogPostFooter: React.FC<BlogPostFooterProps> = ({ onCopyLink, linkCopied }) => {
    const { t } = useLocale();

    return (
        <div className="mt-16 pt-8 border-t border-border-medium flex items-center justify-between text-gray-500 text-sm">
            <p>{t('blogPost.thankYou')}</p>
            <div className="flex items-center gap-4">
                <span className="text-xs uppercase font-bold tracking-wider">
                    {t('blogPost.share')}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={onCopyLink}
                        // CHANGED: h-9 -> h-10 (sm standard), rounded-lg -> rounded-xl
                        className="relative h-10 px-5 rounded-xl bg-item-primary flex items-center gap-2 hover:bg-white hover:text-black transition-all  font-bold"
                    >
                        <i className="fa-regular fa-copy"></i>
                        <span className="text-xs">{t('blogPost.copyLink')}</span>
                        {linkCopied && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg page-reveal whitespace-nowrap pointer-events-none">
                                {t('blogPost.copied')}
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogPostFooter;
