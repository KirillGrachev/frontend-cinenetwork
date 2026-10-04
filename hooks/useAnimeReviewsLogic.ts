import type React from 'react';
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Review } from '../types';
import { ToastType } from '../types';
import { useLocale } from '../context/LocaleContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { ReviewFormValues } from '../utils/validationSchemas';
import { createReviewSchema } from '../utils/validationSchemas';
import { useInteractionStore } from '../store/interactionStore';
import { createLocalEntityId } from '../utils/ids';

export const useAnimeReviewsLogic = (animeId: number, initialReviews: Review[]) => {
    const { t } = useLocale();
    const { user } = useAuth();
    const { showToast } = useToast();

    // --- Data State (Merged Local + Remote) ---
    const localReviews = useInteractionStore((state) => state.reviews[animeId] || []);
    const addReview = useInteractionStore((state) => state.addReview);

    // --- Form State (RHF) ---
    const schema = createReviewSchema(t);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ReviewFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            rating: 0,
            content: '',
            isSpoiler: false,
        },
    });

    const [hoverRating, setHoverRating] = useState(0);

    // --- Interaction State ---
    const [likedReviews, setLikedReviews] = useState<Set<number>>(new Set());
    const [revealedSpoilers, setRevealedSpoilers] = useState<Set<number>>(new Set());

    // --- Report State ---
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [_activeReportId, setActiveReportId] = useState<number | null>(null);

    // --- Sorting State ---
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>(
        'newest',
    );

    // --- Computed ---
    const allReviews = useMemo(() => {
        // Merge local and initial, prioritizing local if duplicates exist (though IDs should differ)
        // Local reviews usually go first as they are "my" reviews
        return [...localReviews, ...initialReviews];
    }, [localReviews, initialReviews]);

    const sortedReviews = useMemo(() => {
        return [...allReviews].sort((a, b) => {
            switch (sortOrder) {
                case 'newest':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'oldest':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'highest':
                    return b.rating - a.rating;
                case 'lowest':
                    return a.rating - b.rating;
                default:
                    return 0;
            }
        });
    }, [allReviews, sortOrder]);

    // --- Form Handlers ---
    const handleStarMouseMove = (e: React.MouseEvent<HTMLElement>, starIndex: number) => {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - left) / width;
        const isHalf = percent < 0.5;
        const value = isHalf ? starIndex * 2 - 1 : starIndex * 2;
        setHoverRating(value);
    };

    const onSubmit = async (data: ReviewFormValues) => {
        const newReview: Review = {
            id: createLocalEntityId(),
            userId: user?.id.toString() || '999',
            username: user?.username || 'Guest',
            avatarUrl: user?.avatarUrl,
            rating: data.rating,
            date: new Date().toISOString().split('T')[0],
            content: data.content,
            likes: 0,
            isSpoiler: data.isSpoiler,
        };

        // Validate DTO boundary (Reverse Mapping Domain -> DTO for API)
        // const reviewDto = mapReviewDomainToDto(newReview);

        // Simulate API call using DTO
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Persist to Store (Optimistic Update)
        addReview(animeId, newReview);

        // Reset Form
        reset();
        setHoverRating(0);

        showToast(t('media.anime.reviews.success'), ToastType.Success);
    };

    // --- Item Handlers ---
    const handleLike = (reviewId: number) => {
        const isLiked = likedReviews.has(reviewId);
        const newLiked = new Set(likedReviews);
        if (isLiked) newLiked.delete(reviewId);
        else newLiked.add(reviewId);
        setLikedReviews(newLiked);
        // Note: For SWR correctness, likes should also be in a store or handled via API mutators.
        // For now, local UI state is fine for the session.
    };

    const toggleSpoiler = (reviewId: number) => {
        const newRevealed = new Set(revealedSpoilers);
        if (newRevealed.has(reviewId)) newRevealed.delete(reviewId);
        else newRevealed.add(reviewId);
        setRevealedSpoilers(newRevealed);
    };

    const handleReportClick = (id: number) => {
        setActiveReportId(id);
        setReportModalOpen(true);
    };

    const handleReportSubmit = (_reason: string, _description: string) => {
        // TODO(api): POST the review report to the backend.
        showToast(t('common.toasts.reportSent'), ToastType.Success);
        setActiveReportId(null);
        setReportModalOpen(false);
    };

    return {
        // Data
        reviews: sortedReviews,
        reviewsCount: sortedReviews.length,

        // Form Props (RHF)
        register,
        setValue,
        watch,
        errors,
        isSubmitting,
        submitReview: handleSubmit(onSubmit),

        // Custom Star Handling
        hoverRating,
        setHoverRating,
        handleStarMouseMove,

        // Interaction State
        likedReviews,
        revealedSpoilers,

        // Interaction Actions
        handleLike,
        toggleSpoiler,

        // Report State & Actions
        reportModalOpen,
        setReportModalOpen,
        handleReportClick,
        handleReportSubmit,

        // Sorting
        sortOrder,
        setSortOrder,

        // Utils
        t,
    };
};
