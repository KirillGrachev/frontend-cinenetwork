
import React from 'react';
import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    initialFocus?: React.MutableRefObject<HTMLElement | null>;
    className?: string; // For overriding specific panel styles if needed
}

const BaseModal: React.FC<BaseModalProps> = ({ 
    isOpen, 
    onClose, 
    children, 
    initialFocus,
    className 
}) => {
    return (
        <Dialog 
            open={isOpen} 
            as="div" 
            className="relative z-[100]" 
            onClose={onClose}
            initialFocus={initialFocus}
        >
            <DialogBackdrop 
                transition
                className="fixed inset-0 bg-black/80 backdrop-blur-sm transition duration-300 data-[closed]:opacity-0" 
            />

            <div className="fixed inset-0 w-full overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <DialogPanel 
                        transition
                        className={`w-full transform transition duration-300 data-[closed]:scale-95 data-[closed]:opacity-0 ${className || ''}`}
                    >
                        {children}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default BaseModal;
