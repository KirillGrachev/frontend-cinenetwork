
import React from 'react';
import { Review } from '../../../types';
import { useLocale } from '../../../context/LocaleContext';

interface ReviewItemProps {
    review: Review;
    isLiked: boolean;
    isSpoilerRevealed: boolean;
    onLike: (id: number) => void;
    onToggleSpoiler: (id: number) => void;
    onReport: (id: number) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ 
    review, 
    isLiked, 
    isSpoilerRevealed, 
    onLike, 
    onToggleSpoiler, 
    onReport 
}) => {
    const { t } = useLocale();

    return (
        <div className="flex items-start gap-4 md:gap-6 animate-fade-in group">
            {/* Avatar - Matches CommentsSection structure (no wrapper) */}
            <div className="w-12 h-12 rounded-2xl bg-item-primary border border-white/10 flex-shrink-0 flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                {review.avatarUrl ? (
                    <img src={review.avatarUrl} alt={review.username} className="w-full h-full object-cover" />
                ) : (
                    review.username.charAt(0).toUpperCase()
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                    <div className="flex items-center gap-3">
                        <span className="text-white font-bold text-base">{review.username}</span>
                        <span className="text-gray-600 text-xs">•</span>
                        <span className="text-gray-500 text-xs">{review.date}</span>
                    </div>
                    
                    {/* Rating Badge - Fixed Alignment */}
                    <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 h-8">
                        <span className="text-white font-black text-sm leading-none pt-[1px]">{(review.rating / 2).toFixed(1)}</span>
                        <span className="text-gray-600 text-[10px] font-bold leading-none mt-[1px]">/ 5</span>
                    </div>
                </div>
                
                <div className="text-gray-300 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                    {review.isSpoiler && !isSpoilerRevealed ? (
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3 text-gray-400">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                    <i className="fa-solid fa-eye-slash"></i>
                                </div>
                                <span className="italic font-medium">{t('media.anime.reviews.spoilerHidden')}</span>
                            </div>
                            <button 
                                onClick={() => onToggleSpoiler(review.id)}
                                className="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors border border-white/5"
                            >
                                {t('media.anime.reviews.showSpoiler')}
                            </button>
                        </div>
                    ) : (
                        <>
                            {t(review.content)}
                            {review.isSpoiler && (
                                <button 
                                    onClick={() => onToggleSpoiler(review.id)}
                                    className="block mt-2 text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-wide"
                                >
                                    {t('media.anime.reviews.hideSpoiler')}
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => onLike(review.id)}
                        className={`flex items-center gap-2 text-xs font-bold transition-colors px-3 py-1.5 rounded-xl border ${
                            isLiked
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 border-transparent hover:border-white/10'
                        }`}
                    >
                        <i className={`${isLiked ? 'fa-solid' : 'fa-regular'} fa-thumbs-up text-sm`}></i>
                        <span>{review.likes || 0}</span>
                    </button>
                    
                    <button 
                        onClick={() => onReport(review.id)}
                        className="text-xs font-bold text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1.5"
                        title={t('report.title')}
                    >
                        <i className="fa-solid fa-flag"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewItem;
