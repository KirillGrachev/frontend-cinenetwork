import React from 'react';
import { useLocale } from '../../context/LocaleContext';

interface TocItem {
    id: string;
    text: string;
}

interface BlogPostSidebarProps {
    tocItems: TocItem[];
    activeId: string;
    onItemClick: (id: string) => void;
}

const BlogPostSidebar: React.FC<BlogPostSidebarProps> = ({ tocItems, activeId, onItemClick }) => {
    const { t } = useLocale();

    if (tocItems.length === 0) return null;

    return (
        <div className="hidden lg:block w-72 flex-shrink-0 sticky top-32">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-4">
                {t('blogPost.tableOfContents')}
            </h4>
            <nav className="flex flex-col space-y-1">
                <div className="relative border-l border-border-medium ml-4">
                    {tocItems.map((item) => {
                        const isActive = activeId === item.id;
                        return (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onItemClick(item.id);
                                }}
                                className={`block py-2 text-sm transition-all duration-200 border-l-2 -ml-[1px] pl-4 ${
                                    isActive
                                        ? 'border-blue-500 text-blue-400 font-medium bg-blue-500/5'
                                        : 'border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                {item.text}
                            </a>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default BlogPostSidebar;
