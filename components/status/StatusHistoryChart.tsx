
import React from 'react';
import { getHealthBarColor } from '../../utils/statusUtils';
import { useLocale } from '../../context/LocaleContext';

interface StatusHistoryChartProps {
    history: number[];
}

const StatusHistoryChart: React.FC<StatusHistoryChartProps> = ({ history }) => {
    const { t } = useLocale();

    return (
        <div className="bg-background-primary rounded-xl  p-5">
            {/* CHANGED: Increased margin-bottom from mb-3 to mb-12 to prevent tooltip overlap with text */}
            <div className="flex justify-between items-end mb-12">
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">{t('status.performance24h')}</span>
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">{t('status.now')}</span>
            </div>
            
            {/* Graph Bars */}
            <div className="flex items-end justify-between gap-1 h-24 w-full">
                {history.map((val, idx) => {
                    const height = Math.max(val, 10);
                    const barColor = getHealthBarColor(val);
                    return (
                        <div key={idx} className={`w-full rounded-sm transition-[height,background-color,opacity] duration-300 relative group/bar ${barColor}`} style={{ height: `${height}%` }}>
                            {/* Tooltip with enlarged readable text */}
                            <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-white">
                                {val}%
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="flex justify-between mt-3 text-xs text-gray-400 font-medium border-t border-border-light pt-2.5">
                <span>{t('status.h24ago')}</span>
                <span>{t('status.h12ago')}</span>
                <span>{t('status.h0ago')}</span>
            </div>
        </div>
    );
};

export default StatusHistoryChart;
