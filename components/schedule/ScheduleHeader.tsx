import React from 'react';
import Button from '../ui/Button';
import { useLocale } from '../../context/LocaleContext';
import { SortDirection } from '../../types';

interface ScheduleHeaderProps {
  count: number;
  sortOrder: SortDirection;
  onToggleSort: () => void;
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({ count, sortOrder, onToggleSort }) => {
  const { t } = useLocale();
  
  return (
    <div className="flex items-center justify-between mb-6 ">
        <div className="text-gray-300 text-base font-medium">
            {t('schedule.episodesToday')}{' '}
            <span className="text-white font-bold">{count}</span>
        </div>
        
        <Button 
            variant="black" 
            size="md" 
            onClick={onToggleSort} 
            className="rounded-xl font-medium min-w-[220px] group transition-all !px-4"
        >
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 group-hover:text-black transition-colors">{t('schedule.timeSort')}</span>
                    <span>{sortOrder === SortDirection.Desc ? t('schedule.sortNewest') : t('schedule.sortOldest')}</span>
                </div>
                <i className={`fa-solid fa-arrow-down-wide-short ml-4 text-gray-400 group-hover:text-black transition-transform duration-300 ${sortOrder === SortDirection.Asc ? 'rotate-180' : ''}`}></i>
            </div>
        </Button>
    </div>
  );
};

export default ScheduleHeader;