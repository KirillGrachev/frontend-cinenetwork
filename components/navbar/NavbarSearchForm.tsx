import React, { useEffect, Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import type { SearchFilters } from '../../types';
import { SearchCategory } from '../../types';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { useNavbarSearchLogic } from '../../hooks/useNavbarSearchLogic';

/**
 * Bridges Headless UI's render-prop `open` state into React state.
 * Must be a real component: calling useEffect directly inside the
 * Popover render-prop callback violates the Rules of Hooks.
 */
const PopoverStateSync: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({
    open,
    onOpenChange,
}) => {
    useEffect(() => {
        onOpenChange(open);
    }, [open, onOpenChange]);
    return null;
};

interface NavbarSearchFormProps {
    searchInputRef: React.RefObject<HTMLInputElement | null>;
    onSubmit: (e: React.FormEvent) => void;
    setIsFilterMenuOpen: (isOpen: boolean) => void;
    onFiltersChange: (filters: SearchFilters) => void;
}

const NavbarSearchForm: React.FC<NavbarSearchFormProps> = ({
    searchInputRef,
    onSubmit,
    setIsFilterMenuOpen,
    onFiltersChange,
}) => {
    const { state, actions } = useNavbarSearchLogic();
    const { t, CATALOG_CONFIG, categories, searchQuery, searchCategory, filters } = state;

    // Sync filters to parent when they change locally
    useEffect(() => {
        onFiltersChange(filters);
    }, [filters, onFiltersChange]);

    const searchPlaceholder = t('navbar.searchPlaceholder', {
        category: t(`navbar.searchCategories.${searchCategory}`),
    });
    const currentYear = new Date().getFullYear().toString();

    return (
        <Popover className="relative w-full h-full flex items-center justify-center">
            {({ open, close }) => {
                return (
                    <>
                        <PopoverStateSync open={open} onOpenChange={setIsFilterMenuOpen} />
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                onSubmit(e);
                                close();
                            }}
                            className="w-full h-full relative z-10"
                        >
                            <div className="relative flex items-center w-full bg-item-primary rounded-full h-full border border-border-light transition-all duration-200 overflow-hidden select-none">
                                {/* Input Area */}
                                <div className="flex-1 flex items-center h-full pl-5 pr-3 min-w-0">
                                    <i className="fa-solid fa-magnifying-glass text-gray-500 flex-shrink-0 text-sm mr-3 pointer-events-none"></i>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder={searchPlaceholder}
                                        className="bg-transparent select-text border-none outline-none text-white w-full placeholder-gray-500 h-full text-sm font-medium focus:outline-none focus-visible:outline-none transition-all duration-200"
                                        value={searchQuery}
                                        onChange={(e) => actions.setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <Popover.Button
                                    aria-label={t('navbar.toggleFilters')}
                                    className={`flex-shrink-0 h-full px-5 flex items-center justify-center transition-colors duration-200 focus:outline-none focus-visible:outline-none outline-none border-none select-none ${
                                        open
                                            ? 'bg-white/15 text-white'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 pointer-events-none">
                                        <i
                                            className={`fa-solid fa-sliders text-sm w-4 h-4 flex items-center justify-center origin-center transition-transform duration-200 ${open ? 'rotate-90' : 'rotate-0'}`}
                                        />
                                    </div>
                                </Popover.Button>
                            </div>
                        </form>

                        {/* Compact Advanced Filter Menu */}
                        <Transition
                            as={Fragment}
                            enter="transition duration-200 ease-out"
                            enterFrom="opacity-0 -translate-y-2"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition duration-150 ease-in"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 -translate-y-2"
                        >
                            <Popover.Panel className="absolute top-full mt-6 left-0 w-full bg-panel-primary border border-border-medium rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-4 z-[100] focus:outline-none focus-visible:outline-none outline-none select-none">
                                {/* Category Selection */}
                                <div className="mb-4">
                                    <span className="text-xs font-semibold text-gray-400 mb-2 block">
                                        {t('common.ui.category')}
                                    </span>
                                    <div className="relative flex bg-item-primary p-1 rounded-xl ">
                                        {categories.map((cat) => {
                                            const isActive = searchCategory === cat.id;
                                            return (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() =>
                                                        actions.setSearchCategory(cat.id)
                                                    }
                                                    className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors duration-200 select-none outline-none ${
                                                        isActive
                                                            ? 'text-white font-bold'
                                                            : 'text-gray-400 hover:text-white'
                                                    }`}
                                                >
                                                    <i className={`${cat.icon} text-xs`}></i>
                                                    <span>{cat.label}</span>
                                                    {isActive && (
                                                        <div className="absolute inset-0 bg-panel-tertiary  rounded-lg shadow-sm -z-10" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Conditional Filters with Animated Mode Switch */}
                                <div className="relative flex flex-col justify-center overflow-hidden transition-all duration-300">
                                    {searchCategory === SearchCategory.Anime ? (
                                        <div
                                            key="anime-filters"
                                            className="space-y-3 animate-fade-in"
                                        >
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-400 mb-1.5 block cursor-default">
                                                        {t('catalog.year')}
                                                    </label>
                                                    <div className="relative group flex items-center">
                                                        <i className="fa-solid fa-calendar-days text-gray-400 group-focus-within:text-white text-xs absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 z-10"></i>
                                                        <input
                                                            type="number"
                                                            placeholder={currentYear}
                                                            value={filters.year || ''}
                                                            onChange={(e) =>
                                                                actions.updateFilter(
                                                                    'year',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full bg-item-primary border border-border-medium rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all duration-200 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        />
                                                    </div>
                                                </div>

                                                <Select
                                                    label={t('catalog.studio')}
                                                    value={filters.studio}
                                                    onChange={(val) =>
                                                        actions.updateFilter('studio', val)
                                                    }
                                                    options={CATALOG_CONFIG.studios}
                                                    placeholder={t('common.ui.any')}
                                                    variant="solid"
                                                />
                                            </div>

                                            <Select
                                                label={t('catalog.genres')}
                                                value={filters.genre}
                                                onChange={(val) =>
                                                    actions.updateFilter('genre', val)
                                                }
                                                options={CATALOG_CONFIG.genres}
                                                placeholder={t('common.ui.anyMasculine')}
                                                variant="solid"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            key="no-filters"
                                            className="py-3 text-center text-gray-400 text-xs sm:text-sm font-medium animate-fade-in"
                                        >
                                            {t('common.ui.filtersUnavailable')}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-3 border-t border-border-medium flex justify-end">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="w-full justify-center font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-md"
                                        onClick={() => actions.handleApplyFilters(close)}
                                    >
                                        {searchCategory === SearchCategory.Anime
                                            ? t('common.ui.applyAndSearch')
                                            : t('common.ui.find')}
                                    </Button>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                );
            }}
        </Popover>
    );
};

export default NavbarSearchForm;
