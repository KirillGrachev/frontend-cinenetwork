import React from 'react';
import { useLocale } from '../context/LocaleContext';

const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg', className?: string }> = ({ size = 'md', className = '' }) => {
  const { t } = useLocale();
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  /** Check if custom border colors/styles are provided in className to avoid conflict with defaults */
  const hasCustomStyles = className.includes('border-');
  const defaultColorClasses = 'border-white/20 border-t-white';

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`
            ${sizeClasses[size]} 
            rounded-full 
            animate-spin
            ${hasCustomStyles ? '' : defaultColorClasses}
            ${className}
        `}
        role="status"
        aria-label={t('common.ui.loading')}
      ></div>
    </div>
  );
};

export default LoadingSpinner;