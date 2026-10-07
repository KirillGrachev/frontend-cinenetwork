
import React from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import TextArea from '../../ui/TextArea';
import Checkbox from '../../ui/Checkbox';
import Button from '../../ui/Button';
import { useLocale } from '../../../context/LocaleContext';
import { useAuth } from '../../../context/AuthContext';
import { ReviewFormValues } from '../../../utils/validationSchemas';

interface ReviewFormProps {
    // RHF Props
    register: UseFormRegister<ReviewFormValues>;
    setValue: UseFormSetValue<ReviewFormValues>;
    watch: UseFormWatch<ReviewFormValues>;
    errors: FieldErrors<ReviewFormValues>;
    isSubmitting: boolean;
    onSubmit: () => void;

    // Custom Interaction Props
    hoverRating: number;
    onRatingHover: (e: React.MouseEvent<HTMLElement>, index: number) => void;
    onRatingLeave: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
    register,
    setValue,
    watch,
    errors,
    isSubmitting,
    onSubmit,
    hoverRating,
    onRatingHover,
    onRatingLeave
}) => {
    const { t } = useLocale();
    const { user } = useAuth();

    // Watch values from RHF to drive UI states
    const currentRating = watch('rating');
    const isSpoiler = watch('isSpoiler');

    const handleRatingClick = () => {
        if (hoverRating > 0) {
            setValue('rating', hoverRating, { shouldValidate: true });
        }
    };

    const renderInteractiveStars = () => {
        const stars = [];
        const currentDisplayRating = hoverRating || currentRating;

        for (let i = 1; i <= 5; i++) {
            let iconClass = 'fa-regular fa-star';
            const starValueFull = i * 2;
            const starValueHalf = i * 2 - 1;

            if (currentDisplayRating >= starValueFull) iconClass = 'fa-solid fa-star';
            else if (currentDisplayRating >= starValueHalf) iconClass = 'fa-solid fa-star-half-stroke';

            const isErrorColor = errors.rating && currentRating === 0 && hoverRating === 0;
            const defaultColor = 'text-gray-700';
            const activeColor = 'text-yellow-400';
            const errorColor = 'text-red-500/80';

            const colorClass = isErrorColor 
                ? errorColor 
                : (currentDisplayRating >= starValueHalf) ? activeColor : defaultColor;

            stars.push(
                <i 
                    key={i}
                    onMouseMove={(e) => onRatingHover(e, i)}
                    onMouseLeave={onRatingLeave}
                    onClick={handleRatingClick}
                    className={`${iconClass} text-2xl cursor-pointer transition-colors ${colorClass}`}
                ></i>
            );
        }
        return stars;
    };

    return (
        <div className="flex items-start gap-4 md:gap-6 mb-10">
            {/* User Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-item-primary border border-white/10 flex-shrink-0 flex items-center justify-center text-gray-500 font-bold overflow-hidden hidden md:flex">
                {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                    <i className="fa-solid fa-user text-lg"></i>
                )}
            </div>

            <div className="flex-1">
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wide">
                            {t('media.anime.reviews.write')}
                        </h4>
                        <div className="flex items-center gap-1">
                            {renderInteractiveStars()}
                        </div>
                    </div>
                    {errors.rating && (
                        <p className="text-[10px] text-red-400 text-right">{errors.rating.message}</p>
                    )}
                </div>

                <TextArea 
                    {...register('content')}
                    placeholder={t('media.anime.reviews.placeholder')}
                    className={`bg-panel-primary min-h-[120px] transition-colors duration-300 border-border-light ${errors.content ? '!border-red-500/50 bg-red-500/5' : ''}`}
                    error={errors.content?.message}
                />

                <div className="flex justify-between items-center pt-3">
                    <Checkbox 
                        label={t('media.anime.reviews.containsSpoiler')}
                        checked={isSpoiler || false}
                        onChange={(val) => setValue('isSpoiler', val)}
                    />
                    <Button 
                        variant="primary" 
                        onClick={onSubmit} 
                        disabled={isSubmitting}
                        className="px-8 rounded-xl shadow-lg"
                    >
                        {isSubmitting ? t('common.ui.loading') : t('media.anime.reviews.submit')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ReviewForm;
