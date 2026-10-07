import React from 'react';
import Input from '../../ui/Input';
import { useLocale } from '../../../context/LocaleContext';

interface FilterYearInputProps {
    min: number;
    max: number;
    onChange: (type: 'min' | 'max', value: string) => void;
}

const FilterYearInput: React.FC<FilterYearInputProps> = ({ min, max, onChange }) => {
    const { t } = useLocale();

    return (
        <div>
            <h4 className="text-xs font-semibold text-gray-400 mb-3">
                {t('catalog.year')}
            </h4>
            <div className="flex items-center gap-2 bg-item-primary/50 p-2 rounded-2xl ">
                <Input 
                    type="number" 
                    value={min}
                    onChange={(e) => onChange('min', e.target.value)}
                    className="!bg-transparent !border-none !p-2 text-center font-bold text-xl h-auto focus:!bg-white/5 rounded-lg" 
                    aria-label="Min Year"
                />
                <span className="text-gray-600 font-bold">—</span>
                <Input 
                    type="number" 
                    value={max}
                    onChange={(e) => onChange('max', e.target.value)}
                    className="!bg-transparent !border-none !p-2 text-center font-bold text-xl h-auto focus:!bg-white/5 rounded-lg" 
                    aria-label="Max Year"
                />
            </div>
        </div>
    );
};

export default FilterYearInput;