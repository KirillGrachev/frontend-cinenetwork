import React from 'react';
import type { Toast } from '../../types';
import { getToastIcon, getToastProgressColor } from '../../utils/styleUtils';
import { useLocale } from '../../context/LocaleContext';

interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
    const { t } = useLocale();
    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                pointer-events-auto bg-item-primary/95 backdrop-blur-md  text-white pl-5 pr-10 py-4 rounded-xl shadow-2xl relative overflow-hidden min-w-[300px] max-w-sm
                ${toast.isClosing ? 'animate-slide-down-fade' : 'animate-slide-up'}
            `}
                >
                    {/* Content Container - Vertically Centered */}
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 flex items-center justify-center">
                            <i className={`${getToastIcon(toast.type)} text-xl`}></i>
                        </div>
                        <span className="text-sm font-medium leading-tight text-gray-100 pr-2">
                            {toast.message}
                        </span>
                    </div>

                    {/* Dismiss Button - Top Right */}
                    <button
                        onClick={() => removeToast(toast.id)}
                        aria-label={t('toasts.dismiss')}
                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                    >
                        <i className="fa-solid fa-xmark text-sm"></i>
                    </button>

                    {/* Progress Bar */}
                    <div
                        className={`absolute bottom-0 left-0 h-0.5 w-full animate-[shrink_3s_linear_forwards] ${getToastProgressColor(toast.type)}`}
                    />
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
