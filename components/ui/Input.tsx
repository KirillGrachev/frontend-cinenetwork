
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  rightIcon?: string;
  onRightIconClick?: () => void;
  rightIconAriaLabel?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', rightIcon, onRightIconClick, rightIconAriaLabel, error, ...props }, ref) => {
  const numberInputStyles = props.type === 'number' 
    ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' 
    : '';

  return (
    <div className="relative w-full">
      <input 
        ref={ref}
        className={`w-full h-12 bg-item-primary border ${error ? 'border-red-500/50' : 'border-border-medium'} rounded-xl pl-4 text-sm outline-none focus:outline-none focus:shadow-none transition-colors placeholder-gray-600 ${rightIcon ? 'pr-12' : 'pr-4'} ${className} ${numberInputStyles}`}
        {...props}
      />
      {rightIcon && (
        <button 
            type="button"
            onClick={onRightIconClick}
            aria-label={rightIconAriaLabel}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors outline-none focus:outline-none"
        >
            <i className={`${rightIcon} w-5 text-center`}></i>
        </button>
      )}
      {error && (
        <span className="absolute -bottom-5 left-1 text-[10px] text-red-400 font-medium animate-fade-in">
            {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
