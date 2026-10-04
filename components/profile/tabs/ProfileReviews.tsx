import React, { useMemo } from 'react';
import AnimeImage from '../../AnimeImage';
import { useLocale } from '../../../context/LocaleContext';
import Button from '../../ui/Button';
import type { ReviewItem, ReviewsFilter } from '../../../utils/profileDataUtils';
interface ProfileReviewsProps {
    activityFeed: ReviewItem[];
    totalReviewsCount: number;
    currentFilter: ReviewsFilter;
    onFilterChange: (filter: ReviewsFilter) => void;
    placeholdersCount?: number;
}
const ProfileReviews: React.FC<ProfileReviewsProps> = ({
    activityFeed,
    totalReviewsCount,
    currentFilter,
    onFilterChange,
}) => {
    const { t } = useLocale();
    const filters: {
        id: 'all' | 'rating' | 'comment';
        label: string;
        icon: string;
    }[] = useMemo(
        () => [
            {
                id: 'all',
                label: t('info.profile.reviewsTab.filterAll'),
                icon: 'fa-solid fa-layer-group',
            },
            {
                id: 'rating',
                label: t('info.profile.reviewsTab.filterRatings'),
                icon: 'fa-solid fa-star',
            },
            {
                id: 'comment',
                label: t('info.profile.reviewsTab.filterComments'),
                icon: 'fa-solid fa-comment',
            },
        ],
        [t],
    );
    const activeFilterObj = filters.find((f) => f.id === currentFilter) || filters[0];
    const cycleFilter = () => {
        const currentIndex = filters.findIndex((f) => f.id === currentFilter);
        const nextIndex = (currentIndex + 1) % filters.length;
        onFilterChange(filters[nextIndex].id as 'all' | 'rating' | 'comment');
    };
    return (
        <div className="page-reveal flex flex-col min-h-[500px]">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold text-white">
                        {t('info.profile.tabs.reviews')}
                    </h3>
                    <span className="text-sm font-bold text-gray-500 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                        {totalReviewsCount}
                    </span>
                </div>

                <div className="w-full md:w-auto">
                    <Button
                        variant="black"
                        size="md"
                        onClick={cycleFilter}
                        className="rounded-xl font-medium min-w-full md:min-w-[220px] group transition-all !px-4"
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <i
                                    className={`${activeFilterObj.icon} text-gray-400 group-hover:text-black transition-colors`}
                                ></i>
                                <span>{activeFilterObj.label}</span>
                            </div>
                            <div className="bg-white/10 rounded-full w-6 h-6 flex items-center justify-center ml-3 group-hover:bg-black/10 transition-colors">
                                <i className="fa-solid fa-rotate text-[10px] text-gray-400 group-hover:text-black transition-colors"></i>
                            </div>
                        </div>
                    </Button>
                </div>
            </div>

            {activityFeed.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl bg-white/5">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                        <i className="fa-regular fa-comments text-2xl"></i>
                    </div>
                    <p className="text-gray-400 font-medium">{t('info.profile.activity.empty')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-40">
                    {activityFeed.map((item) => (
                        <div key={item.id} className="w-full">
                            <div className="group bg-panel-primary border border-border-medium rounded-2xl p-4 hover:border-border-medium hover:bg-panel-secondary transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full min-h-[140px]">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        {item.image ? (
                                            <div className="w-12 h-16 md:w-16 md:h-20 rounded-lg overflow-hidden shadow-lg border border-white/5 group-hover:scale-105 transition-transform duration-500">
                                                <AnimeImage
                                                    src={item.image}
                                                    alt={t(item.title)}
                                                    className="w-full h-full object-cover"
                                                    iconSize="sm"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 border border-white/5 group-hover:bg-white/10 transition-colors">
                                                <i className="fa-solid fa-comment text-lg"></i>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                            <span
                                                className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${item.type === 'rating' ? 'text-yellow-500 bg-yellow-500/10' : 'text-blue-400 bg-blue-500/10'}`}
                                            >
                                                {item.type === 'rating'
                                                    ? t('info.profile.activity.types.rated')
                                                    : t('info.profile.activity.types.commented')}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {item.date}
                                            </span>
                                        </div>

                                        <h4 className="text-sm md:text-base font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer truncate mb-2">
                                            {t(item.title)}
                                        </h4>

                                        {item.type === 'rating' && item.rating ? (
                                            <div className="flex items-end gap-1 leading-none">
                                                <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">
                                                    {item.rating}
                                                </span>
                                                <span className="text-xs font-bold text-gray-500 mb-1">
                                                    / 10
                                                </span>
                                            </div>
                                        ) : (
                                            <p className="text-xs md:text-sm text-gray-400 leading-relaxed line-clamp-3">
                                                {item.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default ProfileReviews;
