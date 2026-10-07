import React from 'react';
import { useLocale } from '../../../context/LocaleContext';

interface FilterPillListProps {
    title: string;
    items: string[];
    activeItems: string[];
    onToggle: (item: string) => void;
}

const FilterPillList: React.FC<FilterPillListProps> = ({ title, items, activeItems, onToggle }) => {
    const { t } = useLocale();

    return (
        <div>
            <h4 className="text-xs font-semibold text-gray-400 mb-3">
                {t(title)}
            </h4>
            <div className="flex flex-wrap gap-2">
                {items.map(item => (
                    <button
                        key={item}
                        onClick={() => onToggle(item)}
                        // Fixed height h-10, rounded-xl for consistency with small buttons
                        className={`h-10 px-4 rounded-xl text-sm font-medium border transition-all duration-200 flex-grow text-center flex items-center justify-center focus:outline-none focus:ring-0 ${
                            activeItems.includes(item) 
                            ? 'bg-white text-black border-transparent shadow-md font-bold' 
                            : 'bg-item-primary border-border-light text-gray-400 hover:bg-white/10 hover:text-white hover:border-border-medium'
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterPillList;