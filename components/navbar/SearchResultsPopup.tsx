
import React from 'react';
import { useNavigate } from 'react-router';
import { SearchCategory, SearchFilters } from '../../types';
import LoadingSpinner from '../LoadingSpinner';
import { useLocale } from '../../context/LocaleContext';
import { useSearchResultsLogic, SearchResultViewModel } from '../../hooks/useSearchResultsLogic';
import { Virtuoso } from 'react-virtuoso';

interface SearchResultsPopupProps {
  query: string;
  category: SearchCategory;
  filters: SearchFilters;
  onOpenPost: (id: number) => void;
  onClose: () => void;
}

const SearchResultsPopup: React.FC<SearchResultsPopupProps> = (props) => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const { state, actions } = useSearchResultsLogic(
        props.query, 
        props.category, 
        props.filters, 
        props.onOpenPost, 
        (path: string) => navigate(path), 
        props.onClose
    );

    const { items, hasMore, isLoading, isNoResults, error, isExpanded } = state;

    const handleKeyDown = (e: React.KeyboardEvent, item: SearchResultViewModel) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            actions.handleClick(item);
        }
    };

    if (isLoading) {
        return (
            <div className="absolute top-full mt-6 left-0 w-full bg-panel-primary border border-border-medium rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden animate-scale-in z-50 py-6 flex justify-center origin-top">
                <LoadingSpinner size="sm" className="opacity-50" /> 
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="absolute top-full mt-6 left-0 w-full bg-panel-primary border border-border-medium rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden animate-scale-in z-50 py-4 text-center text-red-500 text-xs origin-top">
                {t('search.searchError')}
            </div>
        );
    }

    if (isNoResults) {
        return (
            <div className="absolute top-full mt-6 left-0 w-full bg-panel-primary border border-border-medium rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden animate-scale-in z-50 py-6 text-center origin-top">
                <p className="text-sm font-medium text-gray-500">{t('search.noResults')}</p>
            </div>
        );
    }

    if (items.length === 0) return null;

    // Approx height per item ~72px. Max height 300px.
    const listHeight = Math.min(items.length * 72 + 10, 300);

    return (
        <div className="absolute top-full mt-6 left-0 w-full bg-panel-primary border border-border-medium rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden animate-scale-in z-50 flex flex-col origin-top">
            <div className="px-4 py-3 border-b border-border-light bg-panel-primary">
                <span className="text-xs font-semibold text-gray-400">
                    {t('common.search.possibleResults')}
                </span>
            </div>

            <div style={{ height: `${listHeight}px` }}>
                <Virtuoso
                    style={{ height: '100%' }}
                    totalCount={items.length}
                    className="custom-scrollbar"
                    itemContent={(index) => {
                        const item = items[index];
                        return (
                            <div className="px-2 py-1">
                                <div 
                                    onClick={() => actions.handleClick(item)}
                                    onKeyDown={(e) => handleKeyDown(e, item)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={item.title}
                                    className="px-3 py-2.5 rounded-xl hover:bg-white/10 cursor-pointer flex gap-4 transition-colors group"
                                >
                                    {item.image ? (
                                        <div className="w-[45px] h-[64px] flex-shrink-0 rounded-md overflow-hidden bg-panel-tertiary">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-[45px] h-[64px] flex-shrink-0 rounded-md overflow-hidden bg-panel-tertiary flex items-center justify-center text-gray-600">
                                            <i className={`fa-solid ${item.icon} text-lg`}></i>
                                        </div>
                                    )}
                                    
                                    <div className="flex flex-col justify-center min-w-0">
                                        <div className="text-sm font-bold text-white group-hover:text-white/90 truncate pr-2">
                                            {item.title}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs mt-1">
                                            {item.rating && (
                                                <span className="text-green-400 font-bold">{item.rating}</span>
                                            )}
                                            <span className="text-gray-500 truncate">{item.subtitle}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                />
            </div>

            {hasMore && !isExpanded && (
                <div className="border-t border-border-light p-2 bg-black/20 relative z-10">
                    <button 
                        onClick={actions.expand}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-green-500 hover:text-green-400 transition-colors flex items-center gap-1"
                    >
                        {t('common.ui.more')} <i className="fa-solid fa-chevron-down text-[10px]"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchResultsPopup;
