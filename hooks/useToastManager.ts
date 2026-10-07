
import { useState, useRef, useCallback, useEffect } from 'react';
import { Toast, ToastType } from '../types';

/** Helper to generate unique IDs */
const generateToastId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

export const useToastManager = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  /** Track active message text to prevent duplicates */
  const activeToastsMessages = useRef<Set<string>>(new Set());
  /** Track timeouts to clear them on unmount */
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  /** Cleanup timers on unmount */
  useEffect(() => {
    return () => {
        timers.current.forEach(timer => clearTimeout(timer));
        timers.current.clear();
    };
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => {
        const target = prev.find(t => t.id === id);
        /** If doesn't exist or already closing, do nothing */
        if (!target || target.isClosing) return prev;
        
        /** 1. Mark as closing to trigger CSS animation */
        return prev.map(t => t.id === id ? { ...t, isClosing: true } : t);
    });

    /** 2. Schedule actual removal */
    const removalTimer = setTimeout(() => {
        setToasts((prev) => {
            const toastToRemove = prev.find(t => t.id === id);
            if (toastToRemove) {
                activeToastsMessages.current.delete(toastToRemove.message);
            }
            return prev.filter((t) => t.id !== id);
        });
        timers.current.delete(id);
    }, 500); /** Matches CSS animation duration + buffer */

    timers.current.set(id, removalTimer);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = ToastType.Success) => {
    if (activeToastsMessages.current.has(message)) {
        return;
    }

    const id = generateToastId();
    activeToastsMessages.current.add(message);

    setToasts((prev) => {
        const currentToasts = prev.filter(t => !t.isClosing);
        
        /** Max 3 visible toasts */
        if (currentToasts.length >= 3) {
            const oldest = currentToasts[0];
            activeToastsMessages.current.delete(oldest.message);

            return [...currentToasts.slice(1), { id, message, type, isClosing: false }];
        }
        return [...prev, { id, message, type, isClosing: false }];
    });
    
    /** Auto remove after 3 seconds */
    const autoCloseTimer = setTimeout(() => {
      removeToast(id);
    }, 3000);
    
    timers.current.set(id, autoCloseTimer);
  }, [removeToast]);

  return {
      toasts,
      showToast,
      removeToast,
      hasToasts: toasts.length > 0
  };
};
