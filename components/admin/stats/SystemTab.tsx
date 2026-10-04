import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Virtuoso } from 'react-virtuoso';
import type { ActivityLogItem as IActivityLogItem, PlatformStats } from '../../../types/admin';
import type { TFunction } from '../../../context/LocaleContext';
import { ActivityType, ToastType, AppRoute } from '../../../types';
import { hashString, seededRandom } from '../../../utils/random';
import { useToast } from '../../../context/ToastContext';

interface SystemTabProps {
    platformStats: PlatformStats;
    activityLog: IActivityLogItem[];
    t: TFunction;
}

/** Presentation per activity type — data-driven instead of a switch with mutable locals. */
const ACTIVITY_STYLE: Record<
    ActivityType,
    { icon: string; colorClass: string; borderClass: string }
> = {
    [ActivityType.Success]: {
        icon: 'fa-check',
        colorClass: 'text-green-400 bg-green-500/10',
        borderClass: 'border-green-500/20',
    },
    [ActivityType.Warning]: {
        icon: 'fa-triangle-exclamation',
        colorClass: 'text-yellow-400 bg-yellow-500/10',
        borderClass: 'border-yellow-500/20',
    },
    [ActivityType.Info]: {
        icon: 'fa-info',
        colorClass: 'text-blue-400 bg-blue-500/10',
        borderClass: 'border-blue-500/20',
    },
};

const SystemTab: React.FC<SystemTabProps> = ({ platformStats, activityLog, t }) => {
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleExport = () => {
        showToast(t('admin.activityLog.exportStarted'), ToastType.Info);
    };

    /** Simulated network graph — seeded so it doesn't flicker on re-renders. */
    const networkGraph = useMemo(() => {
        const random = seededRandom(hashString('admin-network-graph'));
        return Array.from({ length: 20 }, (_, i) => ({
            id: i,
            height: Math.round(random() * 100),
        }));
    }, []);

    /** Simulated sparkline around a base value — deterministic per value. */
    const getSparkline = (val: number) => {
        const random = seededRandom(hashString(`sparkline_${val}`));
        return Array.from({ length: 12 }, () =>
            Math.max(10, Math.min(100, val + (random() * 40 - 20))),
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-in stagger-2 h-full">
            {/* Content-platform health */}
            <div className="bg-background-secondary border border-border-medium rounded-3xl p-6 md:p-8 flex flex-col h-full min-h-[500px]">
                <h3 className="text-lg font-bold text-white mb-8">
                    {t('admin.charts.platformLoad')}
                </h3>

                <div className="flex flex-col flex-1 gap-8">
                    {/* Media library / Encoding pipeline / Viewing sessions */}
                    <div className="space-y-8 flex-shrink-0">
                        {/* Media library storage */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                                <span>{t('admin.resources.media')}</span>
                                <span className="text-white">{platformStats.media}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 mb-2">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    style={{ width: `${platformStats.media}%` }}
                                ></div>
                            </div>
                            {/* Mini Sparkline */}
                            <div className="flex items-end gap-1 h-6 opacity-30">
                                {getSparkline(platformStats.media).map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-blue-500 rounded-sm"
                                        style={{ height: `${h}%` }}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Encoding queue */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                                <span>{t('admin.resources.encoding')}</span>
                                <span className="text-white">{platformStats.encoding}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 mb-2">
                                <div
                                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                                    style={{ width: `${platformStats.encoding}%` }}
                                ></div>
                            </div>
                            {/* Mini Sparkline */}
                            <div className="flex items-end gap-1 h-6 opacity-30">
                                {getSparkline(platformStats.encoding).map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-pink-500 rounded-sm"
                                        style={{ height: `${h}%` }}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Concurrent viewing sessions */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                                <span>{t('admin.resources.streams')}</span>
                                <span className="text-white">{platformStats.streams}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                    style={{ width: `${platformStats.streams}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* CDN delivery card — stretches to fill remaining space */}
                    <div className="flex-1 bg-panel-primary rounded-2xl p-5  relative overflow-hidden flex flex-col">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
                        <div className="flex items-center justify-between relative z-10 flex-shrink-0">
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">
                                    {t('admin.resources.cdn')}
                                </div>
                                <div className="text-2xl font-mono text-white tracking-tight">
                                    {platformStats.cdn}{' '}
                                    <span className="text-sm text-gray-500">
                                        {t('admin.resources.gbps')}
                                    </span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                <i className="fa-solid fa-network-wired text-green-500 text-sm animate-pulse"></i>
                            </div>
                        </div>
                        {/* Simulated network graph (stable between renders) */}
                        <div className="flex items-end gap-0.5 mt-4 w-full flex-1 min-h-[60px]">
                            {networkGraph.map((bar) => (
                                <div
                                    key={bar.id}
                                    className="flex-1 bg-green-500/20 hover:bg-green-500/40 transition-colors rounded-sm"
                                    style={{ height: `${bar.height}%` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Log (Cards Style) */}
            <div className="lg:col-span-2 bg-panel-primary border border-border-medium rounded-3xl overflow-hidden flex flex-col h-full min-h-[500px]">
                <div className="px-8 py-6 border-b border-border-light flex justify-between items-center flex-shrink-0">
                    <h3 className="font-bold text-white text-lg">{t('admin.activityLog.title')}</h3>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExport}
                            className="text-xs font-bold text-gray-400 hover:text-white transition-colors border border-white/5 hover:border-white/20 hover:bg-white/5 rounded-lg px-3 py-1.5"
                        >
                            <i className="fa-solid fa-download mr-2"></i> {t('common.ui.csv')}
                        </button>
                        <button
                            onClick={() => navigate(AppRoute.AdminActivity)}
                            className="text-xs font-bold text-blue-400 hover:text-white transition-colors border border-blue-500/30 hover:border-blue-400 hover:bg-blue-500 rounded-lg px-3 py-1.5"
                        >
                            {t('admin.activityLog.details')}
                        </button>
                    </div>
                </div>

                <div className="flex-1 min-h-0">
                    <Virtuoso
                        style={{ height: '100%' }}
                        data={activityLog}
                        className="custom-scrollbar"
                        itemContent={(_index, log) => {
                            const { icon, colorClass, borderClass } =
                                ACTIVITY_STYLE[log.type] ?? ACTIVITY_STYLE[ActivityType.Info];

                            return (
                                <div className="px-6 py-2 md:px-8">
                                    <div className="bg-panel-secondary border border-border-medium rounded-2xl p-4 flex items-start gap-4 transition-all hover:bg-white/5 group">
                                        <div
                                            className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border ${colorClass} ${borderClass}`}
                                        >
                                            <i className={`fa-solid ${icon}`}></i>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1 mb-1">
                                                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                                    {t(log.action)}
                                                </h4>
                                                <span className="text-[10px] font-mono text-gray-500 bg-black/20 px-2 py-1 rounded-lg whitespace-nowrap ml-2">
                                                    {log.time}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-gray-400">
                                                    <i className="fa-solid fa-user"></i>
                                                </div>
                                                <span className="text-xs text-gray-300 font-medium">
                                                    {log.user}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SystemTab;
