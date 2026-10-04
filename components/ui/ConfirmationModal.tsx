import React from 'react';
import { DialogTitle } from '@headlessui/react';
import BaseModal from './BaseModal';
import Button from './Button';
import { useLocale } from '../../context/LocaleContext';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: React.ReactNode;
    children?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    children,
    confirmText,
    cancelText,
    variant = 'danger',
}) => {
    const { t } = useLocale();
    const isDanger = variant === 'danger';

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            className="bg-panel-primary border border-border-medium rounded-3xl p-8 max-w-sm shadow-2xl overflow-hidden relative"
        >
            <div className="flex flex-col items-center text-center">
                <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 border ${isDanger ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}
                >
                    <i
                        className={`fa-solid ${isDanger ? 'fa-triangle-exclamation' : 'fa-circle-info'} text-2xl`}
                    ></i>
                </div>

                <DialogTitle as="h3" className="text-xl font-bold text-white mb-2">
                    {title}
                </DialogTitle>

                {description && (
                    <p className="text-gray-400 text-sm leading-relaxed mb-2">{description}</p>
                )}

                {children}

                <div className="flex gap-3 w-full justify-center mt-6">
                    <Button variant="soft" onClick={onClose} className="flex-1 rounded-xl">
                        {cancelText || t('collections.cancel')}
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 rounded-xl font-bold !text-white shadow-lg ${
                            isDanger
                                ? '!bg-red-500 hover:!bg-red-600 !border-red-500'
                                : '!bg-blue-500 hover:!bg-blue-600 !border-blue-500'
                        }`}
                    >
                        {confirmText || t('common.ui.ok')}
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
};

export default ConfirmationModal;
