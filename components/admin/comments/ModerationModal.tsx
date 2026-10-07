import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@headlessui/react';
import BaseModal from '../../ui/BaseModal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { Comment } from '../../../hooks/useAdminComments';
import { BanDuration } from '../../../types';
import { useLocale } from '../../../context/LocaleContext';
import { createModerationRejectSchema, ModerationRejectValues } from '../../../utils/validationSchemas';

interface ModerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    comment: Comment | null;
    action: 'approve' | 'reject';
    onConfirm: (commentId: string, reason?: string, duration?: BanDuration) => void;
}

const ModerationModal: React.FC<ModerationModalProps> = ({ 
    isOpen, 
    onClose, 
    comment, 
    action, 
    onConfirm 
}) => {
    const { t } = useLocale();
    
    const schema = createModerationRejectSchema(t);
    
    const { 
        register, 
        control, 
        handleSubmit, 
        setValue, 
        reset,
        formState: { errors } 
    } = useForm<ModerationRejectValues>({
        resolver: zodResolver(schema),
        defaultValues: { reason: '', duration: BanDuration.None }
    });

    useEffect(() => {
        if (isOpen && comment) {
            if (action === 'reject') {
                setValue('reason', '');
                setValue('duration', BanDuration.None);
            } else {
                reset();
            }
        }
    }, [isOpen, comment, action, t, setValue, reset]);

    if (!comment) return null;

    const onFormSubmit = (data: ModerationRejectValues) => {
        onConfirm(
            comment.id, 
            data.reason, 
            data.duration as BanDuration
        );
        onClose();
    };

    const handleConfirmClick = () => {
        if (action === 'approve') {
            onConfirm(comment.id);
            onClose();
        } else {
            handleSubmit(onFormSubmit)();
        }
    };

    const banOptions = Object.values(BanDuration).map(val => ({
        value: val,
        label: t(`admin.comments.modal.bans.${val}`)
    }));

    const getTitle = () => {
        if (comment.type === 'ticket') {
            return action === 'approve' ? 'Отклонить жалобу' : 'Принять меры';
        }
        return action === 'approve' ? t('admin.comments.modal.approveTitle') : t('admin.comments.modal.rejectTitle');
    };

    const getConfirmText = () => {
        if (comment.type === 'ticket') {
            return action === 'approve' ? 'Оставить контент' : 'Удалить контент';
        }
        return action === 'approve' ? t('admin.comments.modal.confirmApprove') : t('admin.comments.modal.confirmReject');
    };

    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={onClose}
            className="bg-panel-primary border border-border-medium rounded-3xl p-8 max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative"
        >
            <DialogTitle as="h3" className="text-xl font-bold text-white mb-6 flex-shrink-0 text-left">
                {getTitle()}
            </DialogTitle>

            <div className="overflow-y-auto custom-scrollbar pr-2 -mr-2 mb-6">
                
                {comment.type === 'ticket' ? (
                    <div className="space-y-4 text-left">
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2 text-orange-400 text-xs font-bold uppercase tracking-wide">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                {t('admin.comments.sections.tickets')}
                            </div>
                            <p className="text-sm text-white font-medium">"{comment.content}"</p>
                            <div className="mt-3 text-xs text-gray-500 border-t border-orange-500/20 pt-2 flex justify-between">
                                <span>От: {comment.username}</span>
                                <span>{comment.time}</span>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10"></div>
                            <div className="ml-8">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Контекст обращения</p>
                                <div className="bg-panel-secondary border border-border-medium rounded-xl p-3 text-sm text-gray-300">
                                    Тема: {t(comment.animeTitle)}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-6 text-left">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-item-primary flex items-center justify-center text-[10px]">
                                    {comment.username.charAt(0)}
                                </div>
                                <span className="text-xs font-bold text-blue-400">{comment.username}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-300 italic line-clamp-4 leading-relaxed">"{comment.content}"</p>
                    </div>
                )}
                
                {action === 'approve' ? (
                    <p className="text-gray-400 text-sm mt-4 text-left">
                        {comment.type === 'ticket' 
                            ? 'Вы собираетесь закрыть тикет без дополнительных действий.'
                            : t('admin.comments.modal.sureApprove')
                        }
                    </p>
                ) : (
                    <div className="space-y-5 mt-6 text-left">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1 block">
                                {t('admin.comments.modal.reasonLabel')}
                            </label>
                            <Input 
                                {...register('reason')}
                                placeholder={t('admin.comments.modal.reasonPlaceholder')}
                                className="bg-input-primary"
                                error={errors.reason?.message}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1 block">
                                {t('admin.comments.modal.banLabel')}
                            </label>
                            <Controller
                                name="duration"
                                control={control}
                                render={({ field }) => (
                                    <Select 
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={banOptions}
                                        variant="solid"
                                        direction="top"
                                    />
                                )}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-3 mt-auto flex-shrink-0 w-full justify-center">
                <Button 
                    variant="soft" 
                    onClick={onClose} 
                    className="flex-1 rounded-xl"
                >
                    {t('admin.comments.modal.cancel')}
                </Button>
                <Button 
                    variant="primary" 
                    className={`flex-[2] rounded-xl ${
                        action === 'reject' 
                        ? '!bg-red-500 !text-white !border-red-500 hover:!bg-red-600' 
                        : ''
                    }`}
                    onClick={handleConfirmClick}
                >
                    {getConfirmText()}
                </Button>
            </div>
        </BaseModal>
    );
};

export default ModerationModal;