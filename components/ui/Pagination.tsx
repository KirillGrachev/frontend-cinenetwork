import React from 'react';
import Button from './Button';
import { usePagination } from '../../hooks/usePagination';
import { useLocale } from '../../context/LocaleContext';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className = '',
}) => {
    const { t } = useLocale();
    const pages = usePagination(currentPage, totalPages);

    if (totalPages <= 1) return null;

    return (
        <div className={`mt-16 flex items-center justify-center gap-3 ${className}`}>
            {/* CHANGED: rounded-2xl -> rounded-xl */}
            <Button
                variant="secondary"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label={t('pagination.previous')}
                className="w-14 h-14 rounded-xl shadow-lg !px-0 flex items-center justify-center"
            >
                <i className="fa-solid fa-chevron-left text-base"></i>
            </Button>

            {/* CHANGED: rounded-2xl -> rounded-xl for container */}
            <div className="flex items-center gap-1.5 px-2 py-2 rounded-xl border border-white/5 bg-[#1a1a1a]/50 backdrop-blur-md shadow-2xl relative">
                {pages.map((page, index) => {
                    const isActive = currentPage === page;
                    const isEllipsis = page === '...';

                    if (isEllipsis) {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="w-12 h-12 flex items-center justify-center text-gray-500 font-mono text-lg tracking-widest"
                            >
                                {t('common.ui.ellipsis')}
                            </span>
                        );
                    }

                    return (
                        <button
                            key={page}
                            onClick={() => typeof page === 'number' && onPageChange(page)}
                            // CHANGED: rounded-xl (ensuring consistency)
                            className={`relative w-12 h-12 rounded-xl text-lg font-mono font-bold transition-all duration-300 z-10 flex items-center justify-center ${
                                isActive
                                    ? 'text-black shadow-lg scale-105'
                                    : 'text-gray-500 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {isActive && (
                                <div
                                    className="absolute inset-0 bg-white rounded-xl -z-10 page-reveal"
                                    style={{ animationDuration: '0.2s' }}
                                ></div>
                            )}
                            <span className="relative z-10">{page}</span>
                        </button>
                    );
                })}
            </div>

            {/* CHANGED: rounded-2xl -> rounded-xl */}
            <Button
                variant="secondary"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label={t('pagination.next')}
                className="w-14 h-14 rounded-xl shadow-lg !px-0 flex items-center justify-center"
            >
                <i className="fa-solid fa-chevron-right text-base"></i>
            </Button>
        </div>
    );
};

export default Pagination;
