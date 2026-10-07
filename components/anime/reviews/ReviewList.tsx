
import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Review } from '../../../types';
import ReviewItem from './ReviewItem';
import Select from '../../ui/Select';
import EmptyState from '../../ui/EmptyState';
import { useLocale } from '../../../context/LocaleContext';

interface ReviewListProps {
    reviews: Review[];
    sortOrder: string;
    onSortChange: (val: string) => void;
    onLike: (id: number) => void;
    onReport: (id: number) => void;
    onToggleSpoiler: (id: number) => void;
    likedReviewsSet: Set<number>;
    revealedSpoilersSet: Set<number>;
    // isSortOpen and onSortToggle removed
}

const ReviewList: React.FC<ReviewListProps> = ({
    reviews,
    sortOrder,
    onSortChange,
    onLike,
    onReport,
    onToggleSpoiler,
    likedReviewsSet,
    revealedSpoilersSet
}) => {
    const { t } = useLocale();

    const sortOptions = [
        { value: 'newest', label: t('media.anime.reviews.sort.newest') },
        { value: 'oldest', label: t('media.anime.reviews.sort.oldest') },
        { value: 'highest', label: t('media.anime.reviews.sort.highest') },
        { value: 'lowest', label: t('media.anime.reviews.sort.lowest') }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="flex items-center">
                    <h3 className="text-xl font-bold text-white">{t('media.anime.reviews.title')}</h3>
                    <span className="text-2xl text-gray-500 font-bold ml-2">{reviews.length}</span>
                </div>
                
                {reviews.length > 0 && (
                    <div className="w-48 z-20">
                        <Select
                            value={sortOrder}
                            onChange={onSortChange}
                            options={sortOptions}
                            variant="solid"
                            size="sm"
                            prefixIcon="fa-solid fa-arrow-down-short-wide"
                        />
                    </div>
                )}
            </div>

            {/* List */}
            {reviews.length > 0 ? (
                // Use Virtuoso for potentially long list of reviews
                <Virtuoso 
                    useWindowScroll
                    totalCount={reviews.length}
                    overscan={500}
                    itemContent={(index) => {
                        const review = reviews[index];
                        return (
                            <div className="pb-6 mb-6 border-b border-white/5 last:border-0">
                                <ReviewItem 
                                    review={review}
                                    isLiked={likedReviewsSet.has(review.id)}
                                    isSpoilerRevealed={revealedSpoilersSet.has(review.id)}
                                    onLike={onLike}
                                    onReport={onReport}
                                    onToggleSpoiler={onToggleSpoiler}
                                />
                            </div>
                        );
                    }}
                />
            ) : (
                <EmptyState
                    icon="fa-regular fa-comments"
                    title={t('media.anime.reviews.emptyTitle')}
                    description={t('media.anime.reviews.emptyDescription')}
                    className="!bg-white/5 !border-white/5 !min-h-[250px] !p-8"
                />
            )}
        </div>
    );
};

export default ReviewList;
