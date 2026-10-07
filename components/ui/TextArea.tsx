
import React, { forwardRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className = '', error, ...props }, ref) => {
  return (
    <div className="relative w-full">
        <textarea 
        ref={ref}
        className={`w-full bg-item-primary border ${error ? 'border-red-500/50' : 'border-border-medium'} rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors placeholder-gray-600 min-h-[120px] resize-none ${className}`}
        {...props}
        />
        {error && (
            <span className="absolute -bottom-5 left-1 text-[10px] text-red-400 font-medium animate-fade-in">
                {error}
            </span>
        )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
