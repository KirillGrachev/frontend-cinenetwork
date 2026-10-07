import React from 'react';

interface BookmarkButtonProps {
  isBookmarked?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ 
    isBookmarked = false, 
    onClick,
    onMouseEnter,
    onMouseLeave,
    className = ''
}) => {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      type="button"
      aria-label={isBookmarked ? "Remove from favorites" : "Add to favorites"}
      className={`
        group relative w-8 h-10 md:w-9 md:h-11 flex items-start justify-center pt-2.5 md:pt-3
        transition-all duration-200 ease-out hover:scale-105 active:scale-95 origin-top
        focus:outline-none select-none
        ${className}
      `}
    >
      {/* SVG Ribbon matching rating element style (Solid bg-panel-primary, border-white/10, no stream outline) */}
      <svg 
         className="absolute inset-0 w-full h-full pointer-events-none transition-colors duration-200" 
         viewBox="0 0 36 48" 
         preserveAspectRatio="none"
      >
        <path 
           d="M 0.5 -1 L 35.5 -1 L 35.5 46.5 L 18 35 L 0.5 46.5 Z" 
           vectorEffect="non-scaling-stroke"
           className="fill-[#111111] stroke-white/10 transition-colors duration-200"
           strokeWidth="1"
           strokeLinejoin="round"
           strokeLinecap="round"
        />
      </svg>
      
      {/* Icon */}
      <i className={`
        relative z-10 text-xs transition-all duration-200 ease-out
        ${isBookmarked ? 'fa-solid fa-check text-white scale-100' : 'fa-solid fa-plus text-white/90 group-hover:text-white'}
      `}></i>
    </button>
  );
};

export default BookmarkButton;
