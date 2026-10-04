import React, { useState, useEffect } from 'react';
import InfoCard from './ui/InfoCard';
import PageHeader from './ui/PageHeader';
import { useNavigate } from 'react-router';
import Button from './ui/Button';
import SEO from './SEO';
import { useLocale } from '../context/LocaleContext';
import { useSupportLogic } from '../hooks/useSupportLogic';
import SupportForm from './support/SupportForm';
import { AppRoute, ToastType } from '../types';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from './ui/ConfirmationModal';

const Support: React.FC = () => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const { state, actions, register } = useSupportLogic();
    const { showToast } = useToast();

    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [pendingPath, setPendingPath] = useState<string | null>(null);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (state.hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [state.hasUnsavedChanges]);

    const handleNavigate = (path: string) => {
        if (state.hasUnsavedChanges) {
            setPendingPath(path);
            setShowExitConfirm(true);
        } else {
            navigate(path);
        }
    };

    const handleConfirmExit = () => {
        actions.resetForm();
        if (pendingPath) {
            navigate(pendingPath);
        }
    };

    const handleCopyContact = (value: string, label: string) => {
        navigator.clipboard
            .writeText(value)
            .then(() => {
                showToast(`${label} ${t('blogPost.copied').toLowerCase()}`, ToastType.Success);
            })
            .catch(() => {
                showToast(t('common.toasts.copyError'), ToastType.Error);
            });
    };

    return (
        <div className="min-h-screen pt-32 pb-20">
            <SEO
                title={`${t('support.title')} - CineNetwork`}
                description={t('support.description')}
            />

            <div className="container mx-auto px-4 md:px-8 h-full flex flex-col">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        size="md"
                        icon="fa-solid fa-arrow-left"
                        onClick={() => handleNavigate(AppRoute.Home)}
                        className="pl-0 hover:!bg-transparent hover:text-white"
                    >
                        {t('support.backToHome')}
                    </Button>
                </div>

                <PageHeader title={t('support.title')} description={t('support.description')} />

                <div className="w-full">
                    <div className="mb-12">
                        <div className="bg-panel-primary border border-border-medium rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
                            <SupportForm
                                register={register}
                                errors={state.errors}
                                topics={state.topics}
                                isDragOver={state.isDragOver}
                                isSubmitting={state.isSubmitting}
                                attachmentType={state.attachmentType}
                                currentTopic={state.currentTopic}
                                selectedFiles={state.selectedFiles}
                                onSetTopic={actions.setTopic}
                                onTypeChange={actions.setAttachmentType}
                                onSetDrag={actions.setDragOver}
                                onSubmit={actions.submit}
                                onFilesChange={actions.setSelectedFiles}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pb-10">
                        <InfoCard
                            as="button"
                            title={t('support.faq')}
                            onClick={() => handleNavigate(`${AppRoute.Docs}/faq`)}
                        >
                            <p className="text-base text-gray-400 leading-relaxed">
                                {t('support.faqDescription')}
                            </p>
                        </InfoCard>

                        <InfoCard
                            as="button"
                            title={t('support.serviceStatus')}
                            onClick={() => handleNavigate(AppRoute.Status)}
                        >
                            <p className="text-base text-gray-400 leading-relaxed">
                                {t('support.statusDescription')}
                            </p>
                        </InfoCard>

                        <div className="bg-panel-primary border border-border-medium rounded-3xl p-6 h-full text-left relative flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">
                                    {t('support.contacts')}
                                </h3>
                                <div className="space-y-4 pt-2">
                                    <button
                                        onClick={() =>
                                            handleCopyContact('support@cinenetwork.space', 'Email')
                                        }
                                        className="group w-full flex items-center justify-between text-left focus:outline-none"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-500 mb-0.5">
                                                Email
                                            </span>
                                            <span className="text-base font-medium text-gray-300 group-hover:text-blue-400 transition-colors">
                                                support@cinenetwork.space
                                            </span>
                                        </div>
                                        <i className="fa-regular fa-copy text-gray-600 group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100 text-lg"></i>
                                    </button>

                                    <div className="h-px w-full bg-white/5 my-2"></div>

                                    <button
                                        onClick={() =>
                                            handleCopyContact(
                                                'https://t.me/CineNetwork_Off',
                                                'Telegram',
                                            )
                                        }
                                        className="group w-full flex items-center justify-between text-left focus:outline-none"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-500 mb-0.5">
                                                Telegram
                                            </span>
                                            <span className="text-base font-medium text-gray-300 group-hover:text-blue-400 transition-colors">
                                                @CineNetwork_Off
                                            </span>
                                        </div>
                                        <i className="fa-regular fa-copy text-gray-600 group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100 text-lg"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showExitConfirm}
                onClose={() => setShowExitConfirm(false)}
                onConfirm={handleConfirmExit}
                title="Выход без сохранения"
                description="Вы точно хотите покинуть страницу? Все заполненные поля и прикрепленные файлы обнулятся."
                confirmText="Да, покинуть"
                cancelText="Отмена"
                variant="danger"
            />
        </div>
    );
};

export default Support;
