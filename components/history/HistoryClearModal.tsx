import React, { useState } from 'react';
import { DialogTitle } from '@headlessui/react';
import BaseModal from '../ui/BaseModal';
import Button from '../ui/Button';
import { useLocale } from '../../context/LocaleContext';
import { HistoryClearPeriod } from '../../types';

interface HistoryClearModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (period: HistoryClearPeriod) => void;
    title?: string;
    allTimeLabel?: string;
}

const HistoryClearModal: React.FC<HistoryClearModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    allTimeLabel,
}) => {
    const { t } = useLocale();
    const [selectedPeriod, setSelectedPeriod] = useState<HistoryClearPeriod>(
        HistoryClearPeriod.LastHour,
    );

    const periods = [
        {
            id: HistoryClearPeriod.LastHour,
            label: t('history.clearOptions.lastHour'),
            icon: 'fa-regular fa-clock',
        },
        {
            id: HistoryClearPeriod.Today,
            label: t('history.clearOptions.today'),
            icon: 'fa-solid fa-calendar-day',
        },
        {
            id: HistoryClearPeriod.AllTime,
            label: allTimeLabel || t('history.clearOptions.all'),
            icon: 'fa-solid fa-dumpster-fire',
            danger: true,
        },
    ];

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            className="bg-panel-primary border border-border-medium rounded-3xl p-8 max-w-sm shadow-2xl overflow-hidden relative"
        >
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 border bg-red-500/10 border-red-500/20 text-red-500">
                    <i className="fa-regular fa-trash-can text-2xl"></i>
                </div>

                <DialogTitle as="h3" className="text-xl font-bold text-white mb-6">
                    {title || t('history.clearHistory')}
                </DialogTitle>

                {/* Options List */}
                <div className="w-full space-y-2 mb-8">
                    {periods.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setSelectedPeriod(option.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200 group ${
                                selectedPeriod === option.id
                                    ? 'bg-white text-black border-white font-bold shadow-md transform scale-[1.02]'
                                    : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${selectedPeriod === option.id ? 'bg-black/10 text-black' : 'bg-white/10 text-gray-500 group-hover:text-white'}`}
                            >
                                <i className={option.icon}></i>
                            </div>
                            <span className="transition-colors text-left flex-1">
                                {option.label}
                            </span>
                            {selectedPeriod === option.id && (
                                <i className="fa-solid fa-check ml-auto"></i>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3 w-full justify-center">
                    <Button variant="soft" onClick={onClose} className="flex-1 rounded-xl">
                        {t('collections.cancel')}
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm(selectedPeriod);
                            onClose();
                        }}
                        className="flex-1 rounded-xl font-bold !text-white shadow-lg !bg-red-500 hover:!bg-red-700 !border-red-500"
                    >
                        {t('common.ui.delete')}
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
};

export default HistoryClearModal;
