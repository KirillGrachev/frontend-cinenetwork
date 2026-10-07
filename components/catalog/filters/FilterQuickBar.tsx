import React from 'react';
import { CatalogFilterType } from '../../../types';
import { useDraggableScroll } from '../../../hooks/useDraggableScroll';

interface QuickFilterItem {
    type: CatalogFilterType;
    value: string;
    label: string;
}

interface FilterQuickBarProps {
    items: QuickFilterItem[];
    activeSelections: string[];
    activeGenres: string[];
    onToggle: (type: CatalogFilterType, value: string) => void;
}

const FilterQuickBar: React.FC<FilterQuickBarProps> = ({ 
    items, 
    activeSelections, 
    activeGenres, 
    onToggle 
}) => {
    const { ref, events, isDragging, isDown } = useDraggableScroll();

    return (
        <div 
            ref={ref}
            {...events}
            className={`flex-1 w-full overflow-x-auto no-scrollbar relative flex items-center gap-2 px-3 mask-linear-fade select-none ${isDown ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
            {items.map((item) => {
                const isActive = item.type === CatalogFilterType.Selections 
                    ? activeSelections.includes(item.value)
                    : activeGenres.includes(item.value);
                
                return (
                    <button
                        key={`${item.type}-${item.value}`}
                        onClick={() => !isDragging && onToggle(item.type, item.value)}
                        // Fixed height h-10, rounded-full for Chips style
                        className={`flex-shrink-0 h-10 px-5 flex items-center justify-center rounded-full text-sm font-bold transition-colors duration-200 border focus:outline-none focus:ring-0 ${
                            isActive 
                            ? 'bg-white text-black border-transparent' 
                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                        } ${isDragging ? 'pointer-events-none' : ''}`}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
};

export default FilterQuickBar;