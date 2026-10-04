import React from 'react';
import { useScrollableRow } from '../../hooks/useScrollableRow';
import { useLocale } from '../../context/LocaleContext';

interface ScrollableRowProps {
    children: React.ReactNode;
    className?: string;
}

const ScrollableRow: React.FC<ScrollableRowProps> = ({ children, className = '' }) => {
    const { rowRef, canScrollLeft, canScrollRight, scroll } = useScrollableRow();
    const { t } = useLocale();

    const renderScrollButton = (direction: 'left' | 'right') => (
        // Added bottom-4 to center relative to content, ignoring padding
        <div
            className={`absolute ${direction}-0 top-0 bottom-4 z-30 hidden md:flex items-center pointer-events-none`}
        >
            <button
                onClick={() => scroll(direction)}
                aria-label={
                    direction === 'left' ? t('common.ui.scrollLeft') : t('common.ui.scrollRight')
                }
                // UPDATED: Removed backdrop-blur, used solid bg-panel-primary, transition-all duration-300
                className={`pointer-events-auto w-14 h-14 rounded-2xl bg-panel-primary border border-border-medium flex items-center justify-center text-white shadow-xl ${direction === 'left' ? '-ml-7' : '-mr-7'} transition-all duration-300 hover:bg-panel-secondary hover:border-white/20 opacity-0 group-hover/row:opacity-100`}
            >
                <i className={`fa-solid fa-chevron-${direction} text-base`}></i>
            </button>
        </div>
    );

    return (
        <div className={`relative group/row ${className}`}>
            {canScrollLeft && renderScrollButton('left')}
            {canScrollRight && renderScrollButton('right')}

            <div
                ref={rowRef}
                className="flex overflow-x-auto gap-6 no-scrollbar scroll-smooth py-4 px-1"
            >
                {children}
            </div>
        </div>
    );
};

export default ScrollableRow;
