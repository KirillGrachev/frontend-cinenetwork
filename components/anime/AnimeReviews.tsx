
import React from 'react';
import { Review } from '../../types';
import ReportModal from '../ui/ReportModal';
import { useAnimeReviewsLogic } from '../../hooks/useAnimeReviewsLogic';

// Sub-components
import ReviewForm from './reviews/ReviewForm';
import ReviewList from './reviews/ReviewList';

interface AnimeReviewsProps {
    animeId: number;
    reviews: Review[];
}

const AnimeReviews: React.FC<AnimeReviewsProps> = ({ animeId, reviews: initialReviews }) => {
    // Controller Hook
    const {
        // Data
        reviews,
        
        // RHF Props & Actions
        register,
        setValue,
        watch,
        errors,
        isSubmitting,
        submitReview,
        
        // Star Interaction
        hoverRating,
        setHoverRating,
        handleStarMouseMove,

        // Sorting
        sortOrder, setSortOrder,
        
        // List Interactions
        likedReviews, revealedSpoilers,
        handleLike, toggleSpoiler, 
        
        // Reports
        reportModalOpen, handleReportClick, handleReportSubmit, setReportModalOpen
    } = useAnimeReviewsLogic(animeId, initialReviews);

    return (
        <div className="mt-12 pt-8 border-t border-white/10">
            
            <ReviewForm 
                register={register}
                setValue={setValue}
                watch={watch}
                errors={errors}
                isSubmitting={isSubmitting}
                onSubmit={submitReview}
                hoverRating={hoverRating}
                onRatingHover={handleStarMouseMove}
                onRatingLeave={() => setHoverRating(0)}
            />

            <ReviewList 
                reviews={reviews}
                sortOrder={sortOrder}
                onSortChange={(val) => setSortOrder(val as 'newest' | 'oldest' | 'highest' | 'lowest')}
                onLike={handleLike}
                onReport={handleReportClick}
                onToggleSpoiler={toggleSpoiler}
                likedReviewsSet={likedReviews}
                revealedSpoilersSet={revealedSpoilers}
            />

            {/* Conditional rendering for performance: useForm inside modal only initializes when open */}
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

export default AnimeReviews;
