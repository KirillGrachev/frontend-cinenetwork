import React from 'react';
import { useLocale } from '../../../context/LocaleContext';

interface FilterCheckboxListProps {
  title: string;
  items: string[];
  activeItems: string[];
  onToggle: (item: string) => void;
  layout?: 'list' | 'grid'; // Layout variant
}

const FilterCheckboxList: React.FC<FilterCheckboxListProps> = ({
  title,
  items,
  activeItems,
  onToggle,
  layout = 'list'
}) => {
  const { t } = useLocale();

  // Calculate height dynamically up to a max
  // Grid row approx 44px, List item approx 36px
  const ROW_HEIGHT = layout === 'grid' ? 44 : 36;
  const MAX_HEIGHT = 300;
  const containerHeight = Math.min(items.length * ROW_HEIGHT, MAX_HEIGHT);

  return (
    <div>
      <h4 className="text-xs font-semibold text-gray-400 mb-3">
        {t(title)}
      </h4>
      <div className="bg-item-primary/30 border border-border-medium rounded-2xl p-3">
        <div
          className="overflow-y-auto custom-scrollbar"
          style={{
            height: `${containerHeight}px`,
            minHeight: '100px'
          }}
        >
          {layout === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pr-2">
              {items.map((item) => {
                const isActive = activeItems.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => onToggle(item)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center justify-between group focus:outline-none ${
                      isActive
                        ? 'bg-white text-black font-bold'
                        : 'text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="truncate mr-2">{item}</span>
                    {isActive && <i className="fa-solid fa-check text-xs flex-shrink-0"></i>}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item) => {
                const isActive = activeItems.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => onToggle(item)}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-colors focus:outline-none text-left"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
                        isActive
                          ? 'bg-white border-white'
                          : 'border-gray-600 group-hover:border-gray-400'
                      }`}
                    >
                      {isActive && <i className="fa-solid fa-check text-black text-xs"></i>}
                    </div>
                    <span
                      className={`text-sm font-medium truncate ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                      }`}
                    >
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterCheckboxList;