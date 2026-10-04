import React from 'react';
import type { NewsItem } from '../types';
import { useLocale } from '../context/LocaleContext';

/** Polymorphic props definition */
type NewsCardProps<E extends React.ElementType> = {
    item: NewsItem;
    className?: string;
    onClick?: (id: number) => void;
    as?: E;
} & Omit<React.ComponentPropsWithoutRef<E>, 'onClick'>;

const NewsCard = <E extends React.ElementType = 'div'>({
    item,
    className = '',
    onClick,
    as,
    ...props
}: NewsCardProps<E>) => {
    const { t, locale } = useLocale();
    const Component = (as || 'div') as React.ElementType;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
            e.preventDefault();
            onClick(item.id);
        }
    };

    const handleInteraction = () => {
        if (onClick) onClick(item.id);
    };

    /** Format date */
    const formattedDate = new Date(item.date).toLocaleDateString(
        locale === 'ru' ? 'ru-RU' : 'en-US',
        {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        },
    );

    return (
        <Component
            onClick={handleInteraction}
            onKeyDown={handleKeyDown}
            role={as ? undefined : 'button'}
            tabIndex={as ? undefined : 0}
            aria-label={`${t('news.readMore')}: ${t(item.title)}`}
            className={`group relative block bg-background-secondary rounded-3xl p-6 md:p-8 flex flex-col justify-between  transition-all duration-300 hover:border-border-medium hover:bg-panel-primary overflow-hidden cursor-pointer ${className}`}
            {...props}
        >
            {/** Top Meta Info */}
            <div className="flex items-center gap-3 mb-4 z-10">
                <div className="flex items-center gap-2 bg-item-primary px-3 py-1.5 rounded-lg ">
                    <i className="fa-regular fa-calendar text-[10px] text-gray-500"></i>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                        {formattedDate}
                    </span>
                </div>
                <div className="flex items-center gap-2 bg-item-primary px-3 py-1.5 rounded-lg ">
                    <i className="fa-regular fa-clock text-[10px] text-gray-500"></i>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                        {t(item.readTime)}
                    </span>
                </div>
            </div>

            {/** Main Content */}
            <div className="z-10 mb-8 h-full">
                <h3
                    className={`font-bold text-white mb-3 leading-tight group-hover:text-gray-100 transition-colors ${item.isFeatured ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}
                >
                    {t(item.title)}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base line-clamp-3">
                    {t(item.excerpt)}
                </p>
            </div>

            {/** Bottom Actions */}
            <div className="flex items-end justify-between z-10 mt-auto">
                {/** Tags - Rectangular chips with rounded corners */}
                <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, idx) => (
                        <span
                            key={idx}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-gray-400 font-bold tracking-wide transition-all group-hover:border-border-medium group-hover:text-gray-200 hover:!bg-white/10 hover:!text-white backdrop-blur-sm"
                        >
                            <i className="fa-solid fa-tag text-[9px] opacity-60"></i> {t(tag)}
                        </span>
                    ))}
                </div>

                {/** Arrow Button */}
                <div className="w-12 h-12 rounded-xl bg-item-primary border border-border-medium flex items-center justify-center text-gray-400 transition-all duration-300 group-hover:bg-white group-hover:text-black shadow-lg overflow-hidden">
                    <i className="fa-solid fa-arrow-right text-lg transform group-hover:translate-x-1 transition-transform duration-300"></i>
                </div>
            </div>

            {/** Subtle Gradient Glow Effect */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/[0.02] rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:bg-white/[0.04] transition-colors duration-500"></div>
        </Component>
    );
};

export default NewsCard;
