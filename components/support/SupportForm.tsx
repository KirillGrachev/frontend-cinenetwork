import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import LoadingSpinner from '../LoadingSpinner';
import SupportAttachmentSelector from './SupportAttachmentSelector';
import { useLocale } from '../../context/LocaleContext';
import type { SupportTopic, AttachmentType } from '../../types';
import type { SupportFormValues } from '../../utils/validationSchemas';

interface SupportFormProps {
    // Props derived from useForm
    register: UseFormRegister<SupportFormValues>;
    errors: FieldErrors<SupportFormValues>;

    // Controlled states passed down
    topics: SupportTopic[];
    isDragOver: boolean;
    isSubmitting: boolean;
    attachmentType: AttachmentType;
    currentTopic: string;
    selectedFiles: File[];

    // Handlers
    onSetTopic: (id: string) => void;
    onSetDrag: (state: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    onTypeChange: (type: AttachmentType) => void;
    onFilesChange: (files: File[]) => void;
}

const SupportForm: React.FC<SupportFormProps> = ({
    register,
    errors,
    topics,
    isDragOver,
    isSubmitting,
    onSetTopic,
    onSetDrag,
    onSubmit,
    onTypeChange,
    attachmentType,
    currentTopic,
    selectedFiles,
    onFilesChange,
}) => {
    const { t } = useLocale();

    const labelStyle = 'block text-base font-medium text-gray-300 mb-2';

    return (
        <form onSubmit={onSubmit} noValidate autoComplete="nope" className="relative">
            <div className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelStyle}>{t('support.yourName')}</label>
                        <Input
                            className="h-14 text-base"
                            {...register('name')}
                            type="text"
                            placeholder={t('support.namePlaceholder')}
                            error={errors.name?.message}
                            autoComplete="off"
                            maxLength={100}
                        />
                    </div>
                    <div>
                        <label className={labelStyle}>{t('support.contactEmail')}</label>
                        <Input
                            className="h-14 text-base"
                            {...register('email')}
                            type="email"
                            placeholder={t('support.emailPlaceholder')}
                            error={errors.email?.message}
                            autoComplete="off"
                            maxLength={100}
                        />
                    </div>
                </div>

                <div>
                    <label className={labelStyle}>{t('support.problemCategory')}</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {topics.map((tItem) => (
                            <button
                                key={tItem.id}
                                type="button"
                                onClick={() => onSetTopic(tItem.id)}
                                className={`h-14 rounded-xl text-base font-medium transition-all duration-200 border ${currentTopic === tItem.id ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-item-primary text-gray-400 border-border-light hover:bg-panel-tertiary hover:text-white'}`}
                            >
                                {tItem.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className={labelStyle}>{t('support.subject')}</label>
                    <Input
                        className="h-14 text-base"
                        {...register('subject')}
                        placeholder={t('support.subjectPlaceholder')}
                        error={errors.subject?.message}
                        maxLength={200}
                        autoComplete="off"
                    />
                </div>

                <div>
                    <label className={labelStyle}>{t('support.detailedDescription')}</label>
                    <TextArea
                        {...register('message')}
                        placeholder={t('support.descriptionPlaceholder')}
                        error={errors.message?.message}
                        className="text-base min-h-[160px]"
                        maxLength={2000}
                    />
                </div>

                <SupportAttachmentSelector
                    attachmentType={attachmentType}
                    isDragOver={isDragOver}
                    onTypeChange={onTypeChange}
                    onSetDrag={onSetDrag}
                    register={register}
                    error={errors.link?.message}
                    selectedFiles={selectedFiles}
                    onFilesChange={onFilesChange}
                />

                <div className="pt-6 border-t border-white/5 flex justify-end">
                    <Button
                        variant="primary"
                        size="lg"
                        type="submit"
                        className="w-full sm:w-auto min-w-[200px] h-12 text-base font-semibold transition-all rounded-lg"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <LoadingSpinner
                                size="sm"
                                className="w-5 h-5 border-white/20 border-t-white"
                            />
                        ) : (
                            t('support.sendTicket')
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default SupportForm;
