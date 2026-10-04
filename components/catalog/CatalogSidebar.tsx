import React from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import type { CatalogConfig } from '../../types';
import { CatalogFilterType } from '../../types';
import { useLocale } from '../../context/LocaleContext';
import Button from '../ui/Button';
import FilterQuickBar from './filters/FilterQuickBar';
import FilterYearInput from './filters/FilterYearInput';
import FilterPillList from './filters/FilterPillList';
import FilterCheckboxList from './filters/FilterCheckboxList';

interface CatalogSidebarProps {
    config: CatalogConfig;
    filters: {
        seasons: string[];
        genres: string[];
        studios: string[];
        selections: string[];
        yearRange: { min: number; max: number };
    };
    onToggle: (list: CatalogFilterType, item: string, applyImmediately?: boolean) => void;
    onYearChange: (type: 'min' | 'max', value: string) => void;
    onReset: () => void;
    onApply: () => void;
}

const CatalogSidebar: React.FC<CatalogSidebarProps> = ({
    config,
    filters,
    onToggle,
    onYearChange,
    onReset,
    onApply,
}) => {
    const { t } = useLocale();

    /** Combine Selections and top Genres for the quick scroll bar */
    const quickFilters = [
        ...config.selections.map((s) => ({
            type: CatalogFilterType.Selections,
            value: s.value,
            label: s.label,
        })),
        ...config.genres
            .slice(0, 8)
            .map((g) => ({ type: CatalogFilterType.Genres, value: g, label: g })),
    ];

    const activeCount =
        filters.genres.length +
        filters.selections.length +
        filters.studios.length +
        (filters.yearRange.min !== config.yearRange.min ||
        filters.yearRange.max !== config.yearRange.max
            ? 1
            : 0);

    // Helper for quick filters - applies immediately
    const handleQuickToggle = (type: CatalogFilterType, value: string) => {
        onToggle(type, value, true);
    };

    return (
        <div className="w-full mb-8 relative z-40">
            {/* Use Disclosure for the collapsible panel to ensure ARIA compliance */}
            <Disclosure defaultOpen={false}>
                {({ open, close }) => (
                    <>
                        {/** Main Control Bar */}
                        <div className="bg-panel-primary/95 backdrop-blur-xl border border-border-medium rounded-2xl p-2 flex flex-col md:flex-row items-center gap-2 shadow-2xl relative z-20">
                            <FilterQuickBar
                                items={quickFilters}
                                activeSelections={filters.selections}
                                activeGenres={filters.genres}
                                onToggle={handleQuickToggle}
                            />

                            {/* Increased margin to prevent visual overlap with active button border */}
                            <div className="h-8 w-px bg-white/10 hidden md:block mx-2"></div>

                            {/** Filter Toggle Button */}
                            <Disclosure.Button
                                className={`flex-shrink-0 w-full md:w-auto h-12 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-bold text-sm border box-border focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 relative z-10 ${
                                    open || activeCount > 0
                                        ? 'bg-white text-black border-transparent'
                                        : 'bg-item-primary text-gray-400 border-border-medium hover:text-white'
                                }`}
                            >
                                <div className="w-4 h-4 flex items-center justify-center">
                                    <i
                                        className={`fa-solid fa-sliders text-xs ${open || activeCount > 0 ? 'text-black' : ''}`}
                                    ></i>
                                </div>
                                <span>{t('common.ui.filters')}</span>
                                {activeCount > 0 && (
                                    <span className="bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                                        {activeCount}
                                    </span>
                                )}
                                <div className="w-3 h-3 flex items-center justify-center ml-1">
                                    <i
                                        className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                                    ></i>
                                </div>
                            </Disclosure.Button>
                        </div>

                        {/** Collapsible Advanced Panel */}
                        <Transition
                            as="div"
                            show={open}
                            className="grid"
                            enter="transition-[grid-template-rows,opacity,transform] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                            enterFrom="grid-rows-[0fr] opacity-0 -translate-y-2"
                            enterTo="grid-rows-[1fr] opacity-100 translate-y-0"
                            leave="transition-[grid-template-rows,opacity,transform] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                            leaveFrom="grid-rows-[1fr] opacity-100 translate-y-0"
                            leaveTo="grid-rows-[0fr] opacity-0 -translate-y-2"
                        >
                            <Disclosure.Panel static className="overflow-hidden">
                                <div className="min-h-0">
                                    <div className="mt-2 bg-panel-secondary/95 backdrop-blur-2xl border border-border-medium rounded-3xl p-6 md:p-8 shadow-2xl relative">
                                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
                                            {/** Section 1: Years & Seasons (25%) */}
                                            <div className="lg:w-1/4 lg:pr-8 flex flex-col gap-8">
                                                <FilterYearInput
                                                    min={filters.yearRange.min}
                                                    max={filters.yearRange.max}
                                                    onChange={onYearChange}
                                                />

                                                <FilterPillList
                                                    title="catalog.season"
                                                    items={config.seasons}
                                                    activeItems={filters.seasons}
                                                    onToggle={(item) =>
                                                        onToggle(CatalogFilterType.Seasons, item)
                                                    }
                                                />
                                            </div>

                                            {/** Divider */}
                                            <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-white/10 to-transparent mx-4"></div>

                                            {/** Section 2: Studios (25%) */}
                                            <div className="lg:w-1/4 lg:px-4">
                                                <FilterCheckboxList
                                                    title="catalog.studio"
                                                    items={config.studios}
                                                    activeItems={filters.studios}
                                                    onToggle={(item) =>
                                                        onToggle(CatalogFilterType.Studios, item)
                                                    }
                                                    layout="list"
                                                />
                                            </div>

                                            {/** Divider */}
                                            <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-white/10 to-transparent mx-4"></div>

                                            {/** Section 3: Genres (50%) */}
                                            <div className="lg:w-1/2 lg:pl-4">
                                                <FilterCheckboxList
                                                    title="catalog.genres"
                                                    items={config.genres}
                                                    activeItems={filters.genres}
                                                    onToggle={(item) =>
                                                        onToggle(CatalogFilterType.Genres, item)
                                                    }
                                                    layout="grid"
                                                />
                                            </div>
                                        </div>

                                        {/** Footer Actions */}
                                        <div className="mt-8 pt-6 border-t border-border-light flex justify-between items-center">
                                            <Button
                                                variant="ghost"
                                                onClick={onReset}
                                                icon="fa-solid fa-rotate-left"
                                            >
                                                {t('catalog.resetFilters')}
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="lg"
                                                onClick={() => {
                                                    onApply();
                                                    close();
                                                }}
                                                className="px-10"
                                            >
                                                {t('common.ui.applyFilters')}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </Transition>
                    </>
                )}
            </Disclosure>
        </div>
    );
};

export default CatalogSidebar;
