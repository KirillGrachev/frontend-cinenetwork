import React from 'react';
import { useLocale } from '../../context/LocaleContext';

interface StatusSystemHealthProps {
    allOperational: boolean;
}

const StatusSystemHealth: React.FC<StatusSystemHealthProps> = ({ allOperational }) => {
  const { t } = useLocale();
  
  return (
    <div className="mb-12">
        <div className={`rounded-2xl p-6 md:p-8 flex items-center justify-center gap-4 md:gap-6 border backdrop-blur-md min-h-[82px] md:min-h-[98px] ${allOperational ? 'bg-green-900/10 border-green-700/30' : 'bg-yellow-900/10 border-yellow-700/30'}`}>
            <div className={`w-4 h-4 rounded-full ${allOperational ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.6)] animate-pulse'}`}></div>
            <span className={`text-xl md:text-2xl font-bold tracking-tight ${allOperational ? 'text-green-500' : 'text-yellow-500'}`}>
                {allOperational ? t('status.allSystemsOperational') : t('status.someSystemsDown')}
            </span>
        </div>
    </div>
  );
};

export default StatusSystemHealth;
