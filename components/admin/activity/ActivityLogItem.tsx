import React from 'react';
import type { LogEntry } from '../../../types/admin';
import { ActivityType } from '../../../types';
import { useLocale } from '../../../context/LocaleContext';

interface ActivityLogItemProps {
    log: LogEntry;
}

const ActivityLogItem: React.FC<ActivityLogItemProps> = ({ log }) => {
    const { t } = useLocale();

    const getTypeStyles = (type: ActivityType) => {
        switch (type) {
            case ActivityType.Success:
                return {
                    icon: 'fa-check',
                    color: 'text-green-400',
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/20',
                };
            case ActivityType.Warning:
                return {
                    icon: 'fa-triangle-exclamation',
                    color: 'text-yellow-400',
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/20',
                };
            default:
                return {
                    icon: 'fa-info',
                    color: 'text-blue-400',
                    bg: 'bg-blue-500/10',
                    border: 'border-blue-500/20',
                };
        }
    };

    const styles = getTypeStyles(log.type);

    return (
        <div className="bg-panel-secondary border border-border-medium rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-border-medium transition-colors">
            <div
                className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border ${styles.bg} ${styles.border} ${styles.color}`}
            >
                <i className={`fa-solid ${styles.icon}`}></i>
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate mb-1">{t(log.action)}</h4>
                <p className="text-xs text-gray-400 truncate">{log.description}</p>
            </div>

            <div className="flex items-center gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-white/5 mt-2 md:mt-0">
                {/* Time moved here for vertical centering on desktop */}
                <span className="text-xs text-gray-500 font-mono hidden md:block whitespace-nowrap">
                    {log.time}
                </span>

                <div className="flex items-center gap-2 min-w-[120px]">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-gray-400">
                        <i className="fa-solid fa-user"></i>
                    </div>
                    {/* Aligned text */}
                    <span className="text-xs text-gray-300 font-bold translate-y-[1px]">
                        {log.user}
                    </span>
                </div>
                {/* CHANGED: rounded -> rounded-full */}
                <div className="text-[10px] font-mono text-gray-600 bg-black/30 px-3 py-1 rounded-full border border-white/5">
                    {log.ip}
                </div>
                {/* Mobile time view (visible only on mobile) */}
                <span className="text-xs text-gray-500 font-mono md:hidden ml-auto">
                    {log.time}
                </span>
            </div>
        </div>
    );
};

export default ActivityLogItem;
