import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@headlessui/react';
import BaseModal from './BaseModal';
import Button from './Button';
import TextArea from './TextArea';
import { useLocale } from '../../context/LocaleContext';
import type { ReportFormValues } from '../../utils/validationSchemas';
import { createReportSchema } from '../../utils/validationSchemas';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string, description: string) => void;
    title?: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, title }) => {
    const { t } = useLocale();

    const schema = createReportSchema(t);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isValid },
    } = useForm<ReportFormValues>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: {
            reason: 'spam',
            description: '',
        },
    });

    const selectedReason = watch('reason');

    useEffect(() => {
        if (isOpen) {
            reset({ reason: 'spam', description: '' });
        }
    }, [isOpen, reset]);

    const reasons = [
        { id: 'spam', label: t('report.reasons.spam'), icon: 'fa-solid fa-bullhorn' },
        { id: 'spoiler', label: t('report.reasons.spoiler'), icon: 'fa-solid fa-eye-slash' },
        {
            id: 'offensive',
            label: t('report.reasons.offensive'),
            icon: 'fa-solid fa-triangle-exclamation',
        },
        { id: 'other', label: t('report.reasons.other'), icon: 'fa-solid fa-circle-question' },
    ];

    const onFormSubmit = (data: ReportFormValues) => {
        onSubmit(data.reason, data.description || '');
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-md relative bg-panel-primary border border-border-medium rounded-3xl p-8 shadow-2xl flex flex-col max-h-[90vh]"
        >
            <div className="flex flex-col items-center text-center mb-6 flex-shrink-0">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border bg-red-500/10 border-red-500/20 text-red-500">
                    <i className="fa-regular fa-flag text-2xl"></i>
                </div>
                <DialogTitle as="h3" className="text-xl font-bold text-white">
                    {title || t('report.title')}
                </DialogTitle>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col flex-1 min-h-0">
                <div className="overflow-y-auto custom-scrollbar pr-1 -mr-1 space-y-6 px-1">
                    {/* Reasons Selection */}
                    <div className="space-y-2">
                        {reasons.map((reason) => (
                            <button
                                key={reason.id}
                                type="button"
                                onClick={() =>
                                    setValue('reason', reason.id, { shouldValidate: true })
                                }
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200 group ${
                                    selectedReason === reason.id
                                        ? 'bg-white text-black border-white font-bold shadow-md transform scale-[1.02]'
                                        : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${selectedReason === reason.id ? 'bg-black/10 text-black' : 'bg-white/10 text-gray-500 group-hover:text-white'}`}
                                >
                                    <i className={reason.icon}></i>
                                </div>
                                <span className="transition-colors text-sm text-left flex-1 whitespace-nowrap">
                                    {reason.label}
                                </span>
                                {selectedReason === reason.id && (
                                    <i className="fa-solid fa-check ml-auto text-black"></i>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1 flex justify-between">
                            <span>{t('report.description')}</span>
                            {selectedReason === 'other' && errors.description && (
                                <span className="text-[9px] text-red-500">
                                    {errors.description.message}
                                </span>
                            )}
                        </label>
                        <TextArea
                            {...register('description')}
                            placeholder={t('report.descriptionPlaceholder')}
                            className={`bg-item-primary min-h-[80px] transition-colors ${errors.description ? 'border-red-500/30' : ''}`}
                        />
                    </div>
                </div>

                {/* Button Container */}
                <div className="flex gap-3 mt-6 flex-shrink-0 p-1 w-full justify-center">
                    <Button
                        variant="soft"
                        onClick={onClose}
                        type="button"
                        className="flex-1 rounded-xl"
                    >
                        {t('report.cancel')}
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={!isValid}
                        className={`flex-[2] rounded-xl text-white transition-all ${
                            isValid
                                ? '!bg-red-500 !border-red-500 hover:!bg-red-600 shadow-lg hover:shadow-red-900/20'
                                : '!bg-white/5 !border-white/5 !text-gray-500 cursor-not-allowed opacity-50'
                        }`}
                    >
                        {t('report.submit')}
                    </Button>
                </div>
            </form>
        </BaseModal>
    );
};

export default ReportModal;
