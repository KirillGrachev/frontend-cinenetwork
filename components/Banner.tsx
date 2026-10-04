import React from 'react';
import type { BannerItem } from '../types';
import { useCarousel } from '../hooks/useCarousel';
import BannerSlide from './banner/BannerSlide';
import { useLocale } from '../context/LocaleContext';

interface BannerProps {
    items: BannerItem[];
    isLoading?: boolean;
}

const Banner: React.FC<BannerProps> = ({ items, isLoading = false }) => {
    const { currentIndex, setCurrentIndex, handlers } = useCarousel(items?.length || 0, 5000);
    const { t } = useLocale();

    if (!isLoading && (!items || items.length === 0)) {
        return null;
    }

    return (
        <div className={`container mx-auto px-4 md:px-8 pb-8 ${isLoading ? '' : 'page-reveal'}`}>
            <div
                className="w-full aspect-[2/1] md:aspect-[3/1] bg-panel-primary rounded-3xl border border-border-medium relative overflow-hidden group"
                {...(!isLoading ? handlers : {})}
            >
                {isLoading ? (
                    <>
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                        <div className="p-6 md:p-10 flex flex-col justify-between h-full relative z-10">
                            <div className="w-28 h-6 bg-white/10 rounded-full"></div>
                            <div className="space-y-3">
                                <div className="h-7 md:h-10 w-2/3 md:w-1/2 bg-white/15 rounded-xl"></div>
                                <div className="h-4 md:h-5 w-1/3 bg-white/10 rounded-md"></div>
                            </div>
                            <div className="absolute bottom-3 md:bottom-5 left-0 right-0 flex justify-center gap-2">
                                <div className="h-1.5 w-6 md:w-8 bg-white/40 rounded-full"></div>
                                <div className="h-1.5 w-1.5 bg-white/10 rounded-full"></div>
                                <div className="h-1.5 w-1.5 bg-white/10 rounded-full"></div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {items.map((banner, index) => (
                            <BannerSlide
                                key={banner.id}
                                banner={banner}
                                isActive={index === currentIndex}
                            />
                        ))}
                        {items.length > 1 && (
                            <div className="absolute bottom-3 md:bottom-5 left-0 right-0 flex justify-center gap-2 z-30">
                                {items.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ease-out shadow-sm ${
                                            index === currentIndex
                                                ? 'w-6 md:w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                                                : 'w-1.5 bg-white/20 hover:bg-white/40'
                                        }`}
                                        aria-label={t('info.banner.goToSlide', {
                                            slide: index + 1,
                                        })}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Banner;
