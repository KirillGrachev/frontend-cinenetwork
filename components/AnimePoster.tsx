import React from 'react';
import AnimeImage from './AnimeImage';

interface AnimePosterProps {
    src: string;
    alt: string;
    rating?: number;
    className?: string;
    hideOverlay?: boolean;
    showRating?: boolean;
    children?: React.ReactNode;
}

const AnimePoster: React.FC<AnimePosterProps> = ({
    src,
    alt,
    rating,
    className = '',
    hideOverlay = false,
    showRating = true,
    children,
}) => {
    return (
        <div
            className={`w-full h-full relative bg-gray-900 overflow-hidden rounded-2xl transform-gpu [backface-visibility:hidden] [transform-style:preserve-3d] ${className}`}
        >
            {/* Scaling Container: ONLY Image and Dark Overlay */}
            <div className="w-full h-full transition-transform duration-700 ease-out origin-center will-change-transform relative z-0">
                <AnimeImage
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    iconSize="sm"
                />

                {/* Dark Overlay - Moves with image */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none"></div>
            </div>

            {/* Rating Badge - MOVED OUTSIDE scaling container to prevent blur */}
            {showRating && !hideOverlay && rating !== undefined && (
                <div className="absolute top-3 left-3 z-30 pointer-events-none">
                    {/* UPDATED: Matches Play button style (Solid bg-panel-primary, no blur) */}
                    <div className="bg-panel-primary border border-white/10 min-w-[42px] h-[28px] px-2 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold leading-none pt-[1px]">
                            {rating.toFixed(1)}
                        </span>
                    </div>
                </div>
            )}

            {/** Fixed UI Elements (Bookmark Button, etc.) - Outside scaling container */}
            {children}

            {/** Play Button - Centered and Fixed - Outside scaling container */}
            <div className="absolute inset-0 hidden md:flex items-center justify-center transition-opacity duration-300 z-20 pointer-events-none opacity-0 group-hover:opacity-100">
                <div className="w-14 h-14 rounded-2xl bg-panel-primary border border-white/10 text-white shadow-xl flex items-center justify-center">
                    <i className="fa-solid fa-play text-lg ml-1"></i>
                </div>
            </div>
        </div>
    );
};

export default AnimePoster;
