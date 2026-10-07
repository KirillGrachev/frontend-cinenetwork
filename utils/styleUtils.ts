import { ToastType } from '../types';

export const getToastIcon = (type: ToastType) => {
  switch(type) {
      case ToastType.Error: return 'fa-solid fa-circle-xmark text-red-500';
      case ToastType.Success: return 'fa-solid fa-circle-check text-green-500';
      case ToastType.Warning: return 'fa-solid fa-triangle-exclamation text-orange-500';
      default: return 'fa-solid fa-circle-info text-blue-500';
  }
};

export const getToastProgressColor = (type: ToastType) => {
  switch(type) {
      case ToastType.Error: return 'bg-red-500/50';
      case ToastType.Success: return 'bg-green-500/50';
      case ToastType.Warning: return 'bg-orange-500/50';
      default: return 'bg-blue-500/50';
  }
};