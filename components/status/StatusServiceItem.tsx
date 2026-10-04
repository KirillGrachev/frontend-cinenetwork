import React from 'react';
import type { ServiceItem } from '../../types';
import { getStatusColor, getStatusText } from '../../utils/statusUtils';
import { useLocale } from '../../context/LocaleContext';
import StatusHistoryChart from './StatusHistoryChart';

interface StatusServiceItemProps {
    service: ServiceItem;
    isExpanded: boolean;
    onToggle: (id: string) => void;
}

const StatusServiceItem: React.FC<StatusServiceItemProps> = ({ service, isExpanded, onToggle }) => {
    const { t } = useLocale();

    return (
        <div className="transition-colors hover:bg-panel-primary">
            <div
                className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
                onClick={() => onToggle(service.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle(service.id)}
            >
                <div className="flex items-center gap-4">
                    <div
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${getStatusColor(service.status)} ${isExpanded ? 'scale-125' : ''}`}
                    ></div>
                    <div>
                        <div className="font-medium text-white flex items-center gap-2">
                            {service.name}
                            <i
                                className={`fa-solid fa-chevron-down text-xs text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-white' : 'group-hover:text-gray-300'}`}
                            ></i>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 md:hidden">
                            {getStatusText(service.status, t)}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 md:gap-12 text-sm text-right flex-wrap md:flex-nowrap pl-7 md:pl-0">
                    <div className="hidden md:block">
                        <span className="text-gray-500 mr-2">{t('status.uptime')}</span>
                        <span className="text-white font-bold">{service.uptime}%</span>
                    </div>
                    {service.latency && (
                        <div className="hidden md:block">
                            <span className="text-gray-500 mr-2">{t('status.latency')}</span>
                            <span className="text-white font-mono">{service.latency}ms</span>
                        </div>
                    )}
                    {/* CHANGED: rounded-lg -> rounded-full (Status Badge) */}
                    <div className="hidden md:block px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-bold text-gray-300">
                        {getStatusText(service.status, t)}
                    </div>
                </div>
            </div>

            <div
                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${isExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                {/* CHANGED: Removed pt-0 and mt-2, added full padding (p-4 md:p-6) to center content relative to border */}
                <div className="p-4 md:p-6 border-t border-white/5 bg-black/20">
                    <div className="flex justify-between items-center pb-4 mb-4 md:hidden text-xs border-b border-white/5">
                        <div>
                            <span className="text-gray-500 mr-2">{t('status.uptime')}</span>
                            <span className="text-white font-bold">{service.uptime}%</span>
                        </div>
                        {service.latency && (
                            <div>
                                <span className="text-gray-500 mr-2">{t('status.latency')}</span>
                                <span className="text-white font-mono">{service.latency}ms</span>
                            </div>
                        )}
                    </div>

                    <StatusHistoryChart history={service.history} />
                </div>
            </div>
        </div>
    );
};

export default StatusServiceItem;
