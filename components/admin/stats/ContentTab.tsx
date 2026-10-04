import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import type { TopContent } from '../../../types/admin';
import type { TFunction } from '../../../context/LocaleContext';
import { useLocale } from '../../../context/LocaleContext';
import { formatCompactNumber } from '../../../utils/i18n';
import AnimeImage from '../../AnimeImage';
import Select from '../../ui/Select';
import { AdminContentFilter, AppRoute, AnimeType } from '../../../types';

interface ContentTabProps {
    contentDistribution: { label: string; value: number; color: string }[];
    topContent: TopContent[];
    t: TFunction;
}

const ContentTab: React.FC<ContentTabProps> = ({ contentDistribution, topContent, t }) => {
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [filterType, setFilterType] = useState<AdminContentFilter>(AdminContentFilter.All);

    const filterOptions = [
        { value: AdminContentFilter.All, label: t('admin.content.filterAll') },
        { value: AdminContentFilter.TV, label: t('admin.content.filterTv') },
        { value: AdminContentFilter.Movie, label: t('admin.content.filterMovie') },
    ];

    // Filter content based on type - Removed slice(0, 9) to show all data via virtualization
    const filteredContent = topContent.filter((item) => {
        if (filterType === AdminContentFilter.All) return true;
        if (filterType === AdminContentFilter.TV) return item.type === AnimeType.TV;
        if (filterType === AdminContentFilter.Movie) return item.type === AnimeType.Movie;
        return true;
    });

    const handleContentClick = (id: number) => {
        navigate(`/anime/${id}`);
    };

    const handleContentKeyDown = (e: React.KeyboardEvent, id: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleContentClick(id);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 page-reveal">
            {/* Distribution Chart - Redesigned to horizontal layout */}
            <div className="bg-panel-primary border border-border-medium rounded-3xl p-6 lg:col-span-3 flex flex-col md:flex-row items-center gap-8 md:gap-16 justify-center min-h-[320px]">
                {/* Chart Section */}
                <div className="relative w-56 h-56 md:w-64 md:h-64 flex-shrink-0">
                    <div
                        className="w-full h-full rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        style={{
                            background: `conic-gradient(
                                ${contentDistribution[0].color} 0% 35%, 
                                ${contentDistribution[1].color} 35% 60%, 
                                ${contentDistribution[2].color} 60% 80%, 
                                ${contentDistribution[3].color} 80% 90%, 
                                ${contentDistribution[4].color} 90% 100%
                            )`,
                        }}
                    ></div>
                    {/* Center Hole */}
                    <div className="absolute inset-3 bg-panel-primary rounded-full flex flex-col items-center justify-center border border-white/5 shadow-inner">
                        <span className="text-4xl font-bold text-white tracking-tighter">
                            {formatCompactNumber(4200, locale)}
                        </span>
                        <span className="text-xs uppercase font-bold text-gray-500 tracking-widest mt-1">
                            {t('common.ui.titles')}
                        </span>
                    </div>
                </div>

                {/* Legend Section - More detailed now */}
                <div className="flex-1 w-full max-w-lg">
                    <h3 className="text-lg font-bold text-white mb-6">
                        {t('admin.charts.contentDist')}
                    </h3>
                    <div className="space-y-4">
                        {contentDistribution.map((item) => (
                            <div key={item.label} className="group">
                                <div className="flex justify-between items-center mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full shadow-sm"
                                            style={{ backgroundColor: item.color }}
                                        ></div>
                                        <span className="text-sm font-medium text-gray-300">
                                            {item.label}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-white">
                                        {item.value}%
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${item.value}%`,
                                            backgroundColor: item.color,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Content List - Now Virtualized */}
            <div className="lg:col-span-3 bg-panel-primary border border-border-medium rounded-3xl overflow-hidden flex flex-col h-[600px]">
                <div className="px-6 py-5 border-b border-border-light flex justify-between items-center bg-panel-primary z-10 flex-shrink-0">
                    <h3 className="font-bold text-white text-lg">{t('admin.topContent.title')}</h3>

                    <div className="flex items-center gap-3">
                        <div className="w-40">
                            <Select
                                value={filterType}
                                onChange={(val) => setFilterType(val as AdminContentFilter)}
                                options={filterOptions}
                                variant="solid"
                                size="md"
                                className="z-20"
                            />
                        </div>
                        <button
                            onClick={() => navigate(AppRoute.TopCharts)}
                            className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-2 ml-2"
                        >
                            {t('catalog.showAll')} <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>

                <div className="flex-1 min-h-0 bg-panel-primary/50 overflow-y-auto custom-scrollbar">
                    {filteredContent.length > 0 ? (
                        <div className="py-2">
                            {filteredContent.map((item, index) => (
                                <div key={item.id} className="px-4 py-2">
                                    <div
                                        onClick={() => handleContentClick(item.id)}
                                        onKeyDown={(e) => handleContentKeyDown(e, item.id)}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={t('media.anime.viewDetails', {
                                            title: t(item.title),
                                        })}
                                        className="flex items-center gap-4 p-3 rounded-xl bg-panel-secondary/50 border border-transparent hover:border-white/10 hover:bg-panel-secondary transition-all cursor-pointer group"
                                    >
                                        <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-panel-tertiary relative shadow-lg">
                                            <AnimeImage
                                                src={item.image}
                                                alt={t(item.title)}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* FIXED: Removed rounded-tl-lg to fix gap issues. Parent clipping handles it. */}
                                            <div
                                                className={`absolute top-0 left-0 px-1.5 py-0.5 rounded-br-md text-[9px] font-black text-white backdrop-blur-md ${index < 3 ? 'bg-yellow-500/90' : 'bg-black/70'}`}
                                            >
                                                #{index + 1}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors mb-1">
                                                {t(item.title)}
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-gray-300 bg-black/20 px-2 py-1 rounded-full border border-white/5">
                                                    <i className="fa-solid fa-eye text-blue-400 mr-1.5"></i>
                                                    {formatCompactNumber(item.views, locale)}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-300 bg-black/20 px-2 py-1 rounded-full border border-white/5">
                                                    <i className="fa-solid fa-star text-yellow-400 mr-1.5"></i>
                                                    {item.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            {t('search.noResults')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentTab;
