import React from 'react';
import LoadingSpinner from '../LoadingSpinner';
import AnimeImage from '../AnimeImage';

interface PlayerPlaceholderProps {
    thumbnail: string;
    isLoading: boolean;
    onPlay: () => void;
}

const PlayerPlaceholder: React.FC<PlayerPlaceholderProps> = ({ thumbnail, isLoading, onPlay }) => {
    return (
        <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5 group">
            {/* Background Image (Blurred) */}
            <div className="absolute inset-0">
                <AnimeImage
                    src={thumbnail}
                    alt="Video Thumbnail"
                    className="w-full h-full object-cover opacity-60"
                    placeholderClassName="w-12 h-12 rounded-2xl"
                    placeholderIconClassName="text-xl"
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            </div>

            {/* Content Centered */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                {isLoading ? (
                    <LoadingSpinner size="lg" className="border-blue-500 border-t-transparent" />
                ) : (
                    <button
                        onClick={onPlay}
                        // UPDATED: Increased size w-24 h-24
                        className="w-24 h-24 rounded-2xl bg-panel-secondary/80 backdrop-blur-md flex items-center justify-center border border-white/10 text-white shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 transform hover:scale-105 active:opacity-90"
                    >
                        {/* CHANGED: Used pl-1 instead of ml-1 for better optical centering of the triangle icon */}
                        <i className="fa-solid fa-play text-3xl pl-1 text-white"></i>
                    </button>
                )}
            </div>

            {/* Fake Controls Bar (Visual only) */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/90 to-transparent flex items-end px-6 pb-4 gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-white text-xs font-bold">00:00 / 23:45</div>
                <div className="flex-1 h-1 bg-white/20 rounded-full relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-blue-500"></div>
                </div>
                <div className="flex gap-4 text-white text-lg">
                    <i className="fa-solid fa-volume-high hover:text-blue-400 cursor-pointer"></i>
                    <i className="fa-solid fa-gear hover:text-blue-400 cursor-pointer"></i>
                    <i className="fa-solid fa-expand hover:text-blue-400 cursor-pointer"></i>
                </div>
            </div>
        </div>
    );
};

export default PlayerPlaceholder;
