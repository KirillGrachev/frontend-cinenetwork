
import React from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
    icon = "fa-solid fa-magnifying-glass", 
    title, 
    description, 
    actionLabel, 
    onAction,
    className = ""
}) => {
  return (
    <div className={`w-full bg-white/5 border border-dashed border-white/10 rounded-[32px] p-12 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[400px] animate-fade-in ${className}`}>
        
        <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5 ring-1 ring-white/5">
                <i className={`${icon} text-3xl text-gray-500`}></i>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">{title}</h3>
            
            <p className="text-gray-400 text-base leading-relaxed mb-8">
                {description}
            </p>
            
            {actionLabel && onAction && (
                <Button variant="primary" size="md" onClick={onAction} className="min-w-[160px]">
                    {actionLabel}
                </Button>
            )}
        </div>
    </div>
  );
};

export default EmptyState;
