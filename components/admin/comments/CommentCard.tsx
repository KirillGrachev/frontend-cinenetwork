import React from 'react';
import type { Comment } from '../../../types/admin';
import { useLocale } from '../../../context/LocaleContext';
import { CommentStatus, FlagReason } from '../../../types';

interface CommentCardProps {
    comment: Comment;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onApprove, onReject }) => {
    const { t } = useLocale();

    // Determine badge style based on flag reason
    const getFlagBadge = () => {
        if (!comment.flagReason) return null;

        let bgColor = 'bg-gray-800';
        let borderColor = 'border-gray-700';
        let textColor = 'text-gray-400';
        let icon = 'fa-circle-info';

        if (comment.flagReason === FlagReason.UserReport) {
            bgColor = 'bg-orange-500/10';
            borderColor = 'border-orange-500/30';
            textColor = 'text-orange-400';
            icon = 'fa-flag';
        } else if (comment.flagReason === FlagReason.Spam) {
            bgColor = 'bg-red-500/10';
            borderColor = 'border-red-500/30';
            textColor = 'text-red-400';
            icon = 'fa-triangle-exclamation';
        } else if (comment.flagReason === FlagReason.Offensive) {
            bgColor = 'bg-purple-500/10';
            borderColor = 'border-purple-500/30';
            textColor = 'text-purple-400';
            icon = 'fa-skull';
        } else if (comment.flagReason === FlagReason.Spoiler) {
            bgColor = 'bg-yellow-500/10';
            borderColor = 'border-yellow-500/30';
            textColor = 'text-yellow-400';
            icon = 'fa-eye-slash';
        }

        return (
            <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${bgColor} ${borderColor} ${textColor} text-xs font-bold uppercase tracking-wide w-fit mt-3`}
            >
                <i className={`fa-solid ${icon}`}></i>
                <span>{t(`admin.comments.reasons.${comment.flagReason}`)}</span>
            </div>
        );
    };

    const renderRating = (rating10: number) => {
        const rating5 = rating10 / 2;
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating5 >= i) {
                stars.push(<i key={i} className="fa-solid fa-star text-yellow-500"></i>);
            } else if (rating5 >= i - 0.5) {
                stars.push(
                    <i key={i} className="fa-solid fa-star-half-stroke text-yellow-500"></i>,
                );
            } else {
                stars.push(<i key={i} className="fa-regular fa-star text-gray-600"></i>);
            }
        }
        return stars;
    };

    return (
        <div className="bg-panel-primary border border-border-medium rounded-2xl p-5 hover:border-border-medium transition-colors group">
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-item-primary flex items-center justify-center text-gray-500 font-bold overflow-hidden ">
                        {comment.avatar ? (
                            <img
                                src={comment.avatar}
                                alt={t('admin.comments.avatarAlt', { username: comment.username })}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            comment.username.charAt(0).toUpperCase()
                        )}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-bold text-sm hover:text-blue-400 cursor-pointer transition-colors">
                                {comment.username}
                            </span>
                            <span className="text-gray-600 text-xs">•</span>
                            <span className="text-gray-500 text-xs font-mono">{comment.time}</span>
                        </div>
                        <div className="text-xs text-gray-500 font-medium bg-item-primary px-2 py-1 rounded  truncate max-w-full">
                            {t(comment.animeTitle)}{' '}
                            {comment.episode
                                ? `• ${t('media.schedule.episodeShort')} ${comment.episode}`
                                : ''}
                        </div>
                    </div>

                    {comment.rating !== undefined && (
                        <div className="flex items-center gap-1.5 mb-2 bg-black/20 w-fit px-2 py-1 rounded-lg border border-white/5">
                            <div className="flex text-xs space-x-0.5">
                                {renderRating(comment.rating)}
                            </div>
                            <span className="text-xs font-bold text-white ml-1">
                                {(comment.rating / 2).toFixed(1)}
                            </span>
                        </div>
                    )}

                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-1">
                        {t(comment.content)}
                    </p>

                    {getFlagBadge()}
                </div>

                <div className="flex flex-col justify-center gap-2 ml-2">
                    {comment.type === 'ticket' ? (
                        <button
                            onClick={() => onApprove(comment.id)}
                            className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white hover:border-blue-500 flex items-center justify-center transition-all duration-200 shadow-sm active:opacity-80"
                            title={t('admin.comments.ticket.chatTitle')}
                        >
                            <i className="fa-solid fa-comment-dots text-xl"></i>
                        </button>
                    ) : (
                        <>
                            {comment.status !== CommentStatus.Approved && (
                                <button
                                    onClick={() => onApprove(comment.id)}
                                    className="w-9 h-9 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-black hover:border-green-500 flex items-center justify-center transition-all duration-200 shadow-sm active:opacity-80"
                                    title={t('admin.comments.actions.approve')}
                                >
                                    <i className="fa-solid fa-check"></i>
                                </button>
                            )}
                            {comment.status !== CommentStatus.Rejected && (
                                <button
                                    onClick={() => onReject(comment.id)}
                                    className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center transition-all duration-200 shadow-sm active:opacity-80"
                                    title={t('admin.comments.actions.reject')}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentCard;
