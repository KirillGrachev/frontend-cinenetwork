import React from 'react';
import type { ScheduleDay } from '../../types';

interface ScheduleDaySelectorProps {
    days: ScheduleDay[];
    activeDay: string;
    onSelect: (dayId: string) => void;
}

const ScheduleDaySelector: React.FC<ScheduleDaySelectorProps> = ({ days, activeDay, onSelect }) => {
    return (
        <div className="mb-10 ">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {days.map((day) => (
                    <button
                        key={day.id}
                        onClick={() => onSelect(day.id)}
                        // CHANGED: rounded-2xl -> rounded-xl
                        className={`flex flex-col items-center justify-center h-[90px] rounded-xl border transition-all duration-300 group ${
                            activeDay === day.id
                                ? 'bg-white text-black border-white scale-[1.02]'
                                : 'bg-panel-primary text-gray-500 border-border-light hover:bg-item-primary hover:border-border-medium'
                        }`}
                    >
                        <span
                            className={`text-xs font-medium mb-1 ${activeDay === day.id ? 'opacity-60' : 'opacity-40 group-hover:opacity-70'}`}
                        >
                            {day.label}
                        </span>
                        <span
                            className={`text-2xl font-bold uppercase ${activeDay === day.id ? 'text-black' : 'text-white'}`}
                        >
                            {day.short}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ScheduleDaySelector;
