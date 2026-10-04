import React from 'react';
import { useImageLoading } from '../hooks/useImageLoading';

interface AnimeImageProps {
    src: string;
    alt: string;
    className?: string;
    iconSize?: 'sm' | 'md' | 'lg';
    isRectangular?: boolean;
    placeholderClassName?: string; // Custom class for the placeholder box
    placeholderIconClassName?: string; // Custom class for the placeholder icon
}

const AnimeImage: React.FC<AnimeImageProps> = ({
    src,
    alt,
    className = '',
    iconSize = 'md',
    isRectangular = false,
    placeholderClassName,
    placeholderIconClassName,
}) => {
    const { isLoaded, hasError, currentSrc, handleLoad, handleError } = useImageLoading(src);

    /** Define sizes for different contexts - Reduced icon sizes */
    const sizeClasses = {
        sm: {
            // Responsive sizing: Mobile w-9 (36px) vs Play w-10 (40px). Desktop w-12 (48px) vs Play w-14 (56px).
            box: isRectangular
                ? 'w-10 h-7 md:w-12 md:h-8 rounded-lg'
                : 'w-9 h-9 md:w-12 md:h-12 rounded-xl',
            icon: 'text-xs md:text-sm',
        },
        md: {
            box: isRectangular ? 'w-16 h-10 rounded-xl' : 'w-12 h-12 rounded-xl',
            icon: 'text-base',
        },
        lg: {
            box: isRectangular ? 'w-20 h-12 rounded-2xl' : 'w-16 h-16 rounded-2xl',
            icon: 'text-xl',
        },
    };

    const currentSize = sizeClasses[iconSize];

    // Use custom classes if provided, otherwise fallback to preset
    const boxClass = placeholderClassName || currentSize.box;
    const iconClass = placeholderIconClassName || currentSize.icon;

    return (
        <div className={`relative bg-panel-secondary overflow-hidden ${className.trim()}`}>
            {/** 1. SKELETON STATE (Visible while loading) */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                    {/** Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer pointer-events-none"></div>

                    {/** Loading Pulse Icon */}
                    <div
                        className={`${boxClass} bg-white/5 flex items-center justify-center animate-pulse transition-all duration-300`}
                    >
                        <i className={`fa-solid fa-image text-white/10 ${iconClass}`}></i>
                    </div>
                </div>
            )}

            {/** 2. ERROR STATE (Static Placeholder) */}
            {hasError && (
                <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-panel-tertiary p-4 text-center pointer-events-none">
                    {/** Pattern Background */}
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                            backgroundSize: '16px 16px',
                        }}
                    ></div>

                    {/** Static Icon */}
                    <div
                        className={`relative z-10 ${boxClass} bg-white/5 flex items-center justify-center text-white/20 transition-all duration-300`}
                    >
                        <i className={`fa-regular fa-image ${iconClass}`}></i>
                    </div>
                </div>
            )}

            {/** 3. ACTUAL IMAGE */}
            {!hasError && (
                <img
                    src={currentSrc}
                    alt={alt}
                    loading="lazy"
                    className={`block w-full h-full object-cover rounded-[inherit] transform-gpu [backface-visibility:hidden] transition-opacity duration-300 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={handleLoad}
                    onError={handleError}
                />
            )}
        </div>
    );
};

export default AnimeImage;
