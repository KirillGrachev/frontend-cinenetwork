import React, { createContext, useContext } from 'react';
import type { ToastContextType } from '../types';
import ToastContainer from '../components/ui/ToastContainer';
import { useToastManager } from '../hooks/useToastManager';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { toasts, showToast, removeToast, hasToasts } = useToastManager();

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast, hasToasts }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
