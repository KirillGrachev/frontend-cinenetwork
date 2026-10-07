import React from 'react';

interface ErrorTooltipProps {
  message: string;
  className?: string;
}

const ErrorTooltip: React.FC<ErrorTooltipProps> = ({ message, className = '' }) => {
  return (
    <div 
      className={`absolute left-0 top-full mt-2 z-10 w-full animate-fade-in ${className}`} 
      style={{ animationDuration: '0.2s', animationFillMode: 'forwards', opacity: 0 }}
      role="alert"
    >
      <div className="relative bg-[#2a2a2a] border border-red-500/50 text-white text-sm font-medium rounded-xl p-3 flex items-center gap-3 shadow-lg shadow-black/50">
        {/** Arrow Pointer */}
        <div className="absolute left-4 -top-[9px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[9px] border-b-[#2a2a2a]">
            <div className="absolute -top-[-8px] -left-[8px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[9px] border-b-red-500/50"></div>
        </div>

        {/** Icon */}
        <div className="w-6 h-6 bg-red-500 rounded-md flex-shrink-0 flex items-center justify-center">
            <i className="fa-solid fa-xmark text-black text-sm font-bold"></i>
        </div>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default ErrorTooltip;