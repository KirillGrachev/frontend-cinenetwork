import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@headlessui/react';
import BaseModal from '../ui/BaseModal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import LoadingSpinner from '../LoadingSpinner';
import { useLocale } from '../../context/LocaleContext';
import { useToast } from '../../context/ToastContext';
import { ToastType, CuratorStep } from '../../types';
import type { Collection } from '../../types';
import { createLocalEntityId } from '../../utils/ids';
import type { CuratorFormValues } from '../../utils/validationSchemas';
import { createCuratorSchema } from '../../utils/validationSchemas';
import { useUserStore } from '../../store/userStore';

interface CuratorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CuratorModal: React.FC<CuratorModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLocale();
    const { showToast } = useToast();

    // User Store for optimistic update
    const user = useUserStore((state) => state.user);
    const updateUser = useUserStore((state) => state.updateUser);

    const [step, setStep] = useState<CuratorStep>(CuratorStep.Intro);

    const schema = createCuratorSchema(t);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CuratorFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: '', email: '', motivation: '' },
    });

    // No open/close reset effect: the parent mounts this modal only while it
    // is open, so every open starts from fresh initial state by construction.

    const onSubmit = async (data: CuratorFormValues) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Optimistic update: prepend the new collection to the user's profile.
        if (user) {
            const newCollection: Collection = {
                id: createLocalEntityId(),
                title: `Collection by ${data.name}`,
                count: 0,
                image: '', // Placeholder
                color: 'blue',
            };

            updateUser({
                collections: [newCollection, ...(user.collections ?? [])],
            });
        }

        showToast(t('collections.form.successToast'), ToastType.Success);
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            className="bg-panel-primary border border-border-medium rounded-3xl p-8 max-w-md shadow-2xl overflow-hidden relative"
        >
            {/** Step 1: Intro */}
            {step === CuratorStep.Intro && (
                <div className="text-center page-reveal">
                    <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-6 ">
                        <i className="fa-solid fa-wand-magic-sparkles text-2xl text-white"></i>
                    </div>
                    <DialogTitle as="h3" className="text-2xl font-bold text-white mb-3">
                        {t('collections.becomeCurator')}
                    </DialogTitle>
                    <p className="text-gray-400 mb-8 leading-relaxed text-sm">
                        {t('collections.curatorDescription')}
                    </p>
                    <div className="flex gap-3 justify-center w-full">
                        <Button variant="soft" onClick={onClose} className="flex-1 rounded-xl">
                            {t('collections.cancel')}
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 rounded-xl"
                            onClick={() => setStep(CuratorStep.Form)}
                        >
                            {t('collections.start')}
                        </Button>
                    </div>
                </div>
            )}

            {/** Step 2: Application Form */}
            {step === CuratorStep.Form && (
                <form onSubmit={handleSubmit(onSubmit)} className="page-reveal" noValidate>
                    <div className="flex items-center justify-between mb-6">
                        <DialogTitle as="h3" className="text-xl font-bold text-white">
                            {t('collections.form.title')}
                        </DialogTitle>
                        <button
                            type="button"
                            onClick={() => setStep(CuratorStep.Intro)}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1 block">
                                {t('collections.form.name')}
                            </label>
                            <Input
                                {...register('name')}
                                placeholder={t('collections.form.namePlaceholder')}
                                error={errors.name?.message}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1 block">
                                {t('collections.form.email')}
                            </label>
                            <Input
                                {...register('email')}
                                type="email"
                                placeholder={t('collections.form.emailPlaceholder')}
                                error={errors.email?.message}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1 block">
                                {t('collections.form.motivation')}
                            </label>
                            <TextArea
                                {...register('motivation')}
                                placeholder={t('collections.form.motivationPlaceholder')}
                                className="min-h-[100px]"
                                error={errors.motivation?.message}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 w-full justify-center">
                        <Button
                            type="button"
                            variant="soft"
                            onClick={onClose}
                            className="flex-1 rounded-xl"
                        >
                            {t('collections.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-[2] rounded-xl"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <LoadingSpinner
                                    size="sm"
                                    className="w-5 h-5 border-black/20 border-t-black"
                                />
                            ) : (
                                t('collections.form.submit')
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </BaseModal>
    );
};

export default CuratorModal;
