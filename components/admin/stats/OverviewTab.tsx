
import React from 'react';
import { StatMetric } from '../../../hooks/useAdminStats';
import { TFunction, useLocale } from '../../../context/LocaleContext';
import { formatCompactNumber } from '../../../utils/i18n';
import { Trend } from '../../../types';

interface OverviewTabProps {
    metrics: StatMetric[];
    trafficHistory: number[];
    t: TFunction;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ metrics, trafficHistory, t }) => {
    const { locale } = useLocale();
    
    // Calculate max value for bar height scaling
    const maxVal = Math.max(...trafficHistory, 1);

    // Mock dates for the x-axis (last N days)
    const getLabel = (index: number, total: number) => {
        const today = new Date();
        const date = new Date(today);
        date.setDate(today.getDate() - (total - 1 - index));
        const localeString = locale === 'ru' ? 'ru-RU' : 'en-US';
        return date.toLocaleDateString(localeString, { day: '2-digit', month: '2-digit' });
    };

    return (
        <div className="animate-fade-in stagger-2">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                {metrics.map((metric) => (
                    <div key={metric.id} className="bg-panel-primary border border-border-medium rounded-2xl p-5 relative overflow-hidden group hover:border-border-medium transition-all hover:shadow-xl">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${metric.color} text-lg border border-white/5`}>
                                <i className={metric.icon}></i>
                            </div>
                            {/* CHANGED: rounded-md -> rounded-full */}
                            <div className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${metric.trend === Trend.Up ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {metric.trend === Trend.Up ? <i className="fa-solid fa-arrow-trend-up text-[8px]"></i> : <i className="fa-solid fa-arrow-trend-down text-[8px]"></i>}
                                {metric.change}
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1 tracking-tight relative z-10">
                            {formatCompactNumber(metric.value, locale)}
                        </div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide relative z-10">{t(metric.label)}</div>
                        <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full opacity-[0.08] blur-3xl ${metric.color.replace('text-', 'bg-')}`}></div>
                    </div>
                ))}
            </div>

            {/* Main Chart - Histogram (Structure matching ProfileDynamics) */}
            <div className="bg-background-secondary border border-border-medium rounded-3xl p-6 md:p-10 shadow-xl relative">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-8 gap-4 relative z-10">
                    <div>
                        <h3 className="text-xl font-bold text-white">{t('admin.overview.trafficTitle')}</h3>
                        <p className="text-xs text-gray-500 mt-1">{t('admin.overview.trafficSubtitle')}</p>
                    </div>
                </div>
                
                <div className="relative h-64 w-full">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
                        <div className="w-full h-px bg-white/10 border-t border-dashed border-white/20"></div>
                        <div className="w-full h-px bg-white/10 border-t border-dashed border-white/20"></div>
                        <div className="w-full h-px bg-white/10 border-t border-dashed border-white/20"></div>
                        <div className="w-full h-px bg-white/10 border-t border-dashed border-white/20"></div>
                    </div>

                    {/* Bars Container */}
                    <div className="flex items-end justify-between gap-1 sm:gap-2 h-full w-full px-2 relative z-10">
                        {trafficHistory.map((val, i) => {
                            // Formula: min 5%, max 100%
                            const heightPercent = Math.min(100, Math.max(5, (val / maxVal) * 100));
                            const label = getLabel(i, trafficHistory.length);
                            // Multiply mock data by 1000 to get representative view counts
                            const realValue = val * 1000;
                            
                            // Logic to show labels periodically if too many bars
                            const showLabel = trafficHistory.length <= 14 || i % Math.ceil(trafficHistory.length / 10) === 0;

                            return (
                                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                                    {/* Bar */}
                                    <div 
                                        className={`w-full max-w-[30px] rounded-t-sm relative transition-all duration-300 ${val > 0 ? 'bg-blue-600 hover:bg-blue-500' : 'bg-white/5'}`}
                                        style={{ height: `${heightPercent}%` }}
                                    >
                                        {/* Tooltip (Inside bar for relative positioning) */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-black border border-white/10 px-3 py-1.5 rounded-xl text-white font-bold pointer-events-none whitespace-nowrap z-20 shadow-xl">
                                            {formatCompactNumber(realValue, locale)}
                                        </div>
                                    </div>

                                    {/* X-Axis Label */}
                                    {showLabel && (
                                        <div className="mt-3 text-[9px] font-bold text-gray-600 uppercase group-hover:text-white transition-colors absolute bottom-[-25px]">
                                            {label}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
