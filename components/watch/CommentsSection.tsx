import React, { useState, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SimpleComment } from '../../types';
import { ToastType } from '../../types';
import { useLocale } from '../../context/LocaleContext';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import EmptyState from '../ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ReportModal from '../ui/ReportModal';
import type { CommentFormValues } from '../../utils/validationSchemas';
import { createCommentSchema } from '../../utils/validationSchemas';
import { useInteractionStore } from '../../store/interactionStore';
import { createLocalEntityId } from '../../utils/ids';

interface CommentsSectionProps {
    animeId: number;
    comments: SimpleComment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
    animeId,
    comments: initialComments,
}) => {
    const { t } = useLocale();
    const { user } = useAuth();
    const { showToast } = useToast();

    // Store Logic
    const localComments = useInteractionStore((state) => state.comments[animeId] || []);
    const addComment = useInteractionStore((state) => state.addComment);

    const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

    // Form Setup
    const schema = createCommentSchema(t);
    const {
        register,
        handleSubmit,
        reset,
        formState: { isValid, isSubmitting },
    } = useForm<CommentFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { content: '' },
        mode: 'onChange',
    });

    // Reporting state
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [_activeReportId, setActiveReportId] = useState<number | null>(null);

    // Sorting State
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'popular'>('newest');

    const sortOptions = [
        { value: 'newest', label: t('media.anime.comments.sort.newest') },
        { value: 'oldest', label: t('media.anime.comments.sort.oldest') },
        { value: 'popular', label: t('media.anime.comments.sort.popular') },
    ];

    const allComments = useMemo(() => {
        return [...localComments, ...initialComments];
    }, [localComments, initialComments]);

    const sortedComments = useMemo(() => {
        return [...allComments].sort((a, b) => {
            switch (sortOrder) {
                case 'newest':
                    return b.id - a.id;
                case 'oldest':
                    return a.id - b.id;
                case 'popular':
                    return (b.likes || 0) - (a.likes || 0);
                default:
                    return 0;
            }
        });
    }, [allComments, sortOrder]);

    const onSubmit = async (data: CommentFormValues) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newComment: SimpleComment = {
            id: createLocalEntityId(),
            userId: user?.id.toString() || 'guest',
            username: user?.username || 'Guest',
            content: data.content,
            date: t('time.justNow'),
            avatarUrl: user?.avatarUrl,
            likes: 0,
        };

        // Persist
        addComment(animeId, newComment);
        reset();
    };

    const handleLike = (id: number) => {
        const isLiked = likedComments.has(id);
        const newSet = new Set(likedComments);
        if (isLiked) newSet.delete(id);
        else newSet.add(id);
        setLikedComments(newSet);
    };

    const handleReportClick = (id: number) => {
        setActiveReportId(id);
        setReportModalOpen(true);
    };

    const handleReportSubmit = (_reason: string, _description: string) => {
        // TODO(api): POST the comment report to the backend.
        showToast(t('common.toasts.reportSent'), ToastType.Success);
        setActiveReportId(null);
    };

    return (
        <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <h3 className="text-xl font-bold text-white">
                        {t('media.anime.comments.title')}
                    </h3>
                    <span className="text-2xl text-gray-500 font-bold ml-2">
                        {allComments.length}
                    </span>
                </div>

                {allComments.length > 0 && (
                    <div className="w-48 z-20">
                        <Select
                            value={sortOrder}
                            onChange={(val) => setSortOrder(val as 'newest' | 'oldest' | 'popular')}
                            options={sortOptions}
                            variant="solid"
                            size="md"
                            prefixIcon="fa-solid fa-arrow-down-short-wide"
                        />
                    </div>
                )}
            </div>

            {/* Input Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mb-8 flex items-start gap-4 md:gap-6"
            >
                <div className="w-12 h-12 rounded-2xl bg-item-primary border border-border-medium flex-shrink-0 overflow-hidden">
                    {user?.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <i className="fa-solid fa-user text-lg"></i>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <TextArea
                        {...register('content')}
                        placeholder={t('media.anime.reviews.placeholder')}
                        className="min-h-[80px] mb-2 bg-panel-primary border-border-light"
                    />
                    <div className="flex justify-end">
                        <Button
                            variant="primary"
                            size="md"
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="rounded-xl px-10 font-bold shadow-lg"
                        >
                            {isSubmitting
                                ? t('common.ui.loading')
                                : t('media.anime.reviews.submit')}
                        </Button>
                    </div>
                </div>
            </form>

            {/* Virtualized Comment List */}
            {allComments.length > 0 ? (
                <div className="min-h-[300px]">
                    <Virtuoso
                        useWindowScroll
                        totalCount={sortedComments.length}
                        overscan={500}
                        itemContent={(index) => {
                            const comment = sortedComments[index];
                            const isLiked = likedComments.has(comment.id);
                            // Optimistic like display
                            const displayLikes = (comment.likes || 0) + (isLiked ? 1 : 0);

                            return (
                                <div className="flex items-start gap-4 md:gap-6 group pb-6 animate-fade-in">
                                    <div className="w-12 h-12 rounded-2xl bg-item-primary border border-border-medium flex-shrink-0 flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                                        {comment.avatarUrl ? (
                                            <img
                                                src={comment.avatarUrl}
                                                alt={comment.username}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            comment.username.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-white text-base">
                                                {comment.username}
                                            </span>
                                            <span className="text-xs text-gray-600">•</span>
                                            <span className="text-xs text-gray-500">
                                                {comment.date}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed mb-2">
                                            {comment.content}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleLike(comment.id)}
                                                className={`flex items-center gap-2 text-xs font-bold transition-colors px-3 py-1.5 rounded-xl border ${
                                                    isLiked
                                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                        : 'text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 border-transparent hover:border-white/10'
                                                }`}
                                            >
                                                <i
                                                    className={`${isLiked ? 'fa-solid' : 'fa-regular'} fa-thumbs-up text-sm`}
                                                ></i>
                                                <span>{displayLikes}</span>
                                            </button>

                                            <button
                                                onClick={() => handleReportClick(comment.id)}
                                                className="text-xs font-bold text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1.5"
                                                title={t('report.title')}
                                            >
                                                <i className="fa-solid fa-flag"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            ) : (
                <EmptyState
                    icon="fa-regular fa-comments"
                    title={t('media.anime.comments.emptyTitle')}
                    description={t('media.anime.comments.emptyDescription')}
                    className="!bg-white/5 !border-white/5 !min-h-[250px] !p-8"
                />
            )}

            {/* Conditional rendering: ReportModal useForm is only initialized when open */}
            {reportModalOpen && (
                <ReportModal
                    isOpen={reportModalOpen}
                    onClose={() => setReportModalOpen(false)}
                    onSubmit={handleReportSubmit}
                />
            )}
        </div>
    );
};

export default CommentsSection;
