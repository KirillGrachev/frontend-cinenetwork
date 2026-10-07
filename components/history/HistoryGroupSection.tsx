import React, { useState } from 'react';
import { useLocale } from '../../context/LocaleContext';
import { HistoryItem } from '../../types';
import HistoryItemCard from './HistoryItemCard';

interface HistoryGroupSectionProps {
    label: string;
    items: HistoryItem[];
    onRemove: (id: string) => void;
}

const HistoryGroupSection: React.FC<HistoryGroupSectionProps> = ({ label, items, onRemove }) => {
    // Determine limit. If more than 4 items, show only 4 initially.
    const INITIAL_LIMIT = 4;
    const [isExpanded, setIsExpanded] = useState(false);
    const { t } = useLocale();
    
    // Logic: if total items are 5 or 6, just show them all to avoid a button for 1-2 items.
    // If > 6, collapse to 4.
    const shouldCollapse = items.length > 6;
    const displayedItems = (shouldCollapse && !isExpanded) ? items.slice(0, INITIAL_LIMIT) : items;
    const hiddenCount = items.length - INITIAL_LIMIT;

    return (
        <div className="animate-fade-in mb-12 last:mb-0">
            <div className="flex items-center gap-4 mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                    {label} 
                    <span className="text-gray-600 text-2xl md:text-3xl">{items.length}</span>
                </h3>
                <div className="h-px bg-white/10 flex-1 mt-1"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedItems.map(item => (
                    <HistoryItemCard 
                        key={item.id} 
                        item={item} 
                        onRemove={onRemove}
                    />
                ))}
            </div>

            {shouldCollapse && !isExpanded && (
                <button 
                    onClick={() => setIsExpanded(true)}
                    className="w-full mt-4 py-3 rounded-xl border border-dashed border-white/10 text-sm font-bold text-gray-500 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all uppercase tracking-wide flex items-center justify-center gap-2"
                    aria-label={t('history.showMoreFor', { group: label })}
                >
                    <span>{t('common.ui.showMore')} ({hiddenCount})</span>
                    <i className="fa-solid fa-chevron-down"></i>
                </button>
            )}
        </div>
    );
};

export default HistoryGroupSection;