
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { BannerItem, ToastType } from '../../types';
import { useImageLoading } from '../../hooks/useImageLoading';
import { useToast } from '../../context/ToastContext';
import { useLocale } from '../../context/LocaleContext';
import ConfirmationModal from '../ui/ConfirmationModal';

interface BannerSlideProps {
    banner: BannerItem;
    isActive: boolean;
}

const BannerSlide: React.FC<BannerSlideProps> = ({ banner, isActive }) => {
    /** We assume desktop image is the default. Mobile image logic: '1.png' -> '1_mobile.png' */
    const desktopSrc = banner.imageUrl;
    const mobileSrc = desktopSrc.replace(/(\.[\w\d_-]+)$/i, '_mobile$1');

    /** useImageLoading manages loading state. It attaches to the <img> tag onLoad event. */
    /** The event fires regardless of which source <picture> selects. */
    const { isLoaded, handleLoad, handleError } = useImageLoading(desktopSrc);
    const { showToast } = useToast();
    const { t } = useLocale();

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const navigate = useNavigate();
    const isExternalLink = banner.link?.startsWith('http') || banner.link?.startsWith('https');

    const handleClick = () => {
        if (!isActive || !banner.link) return;
        if (isExternalLink) {
            setIsConfirmOpen(true);
        } else {
            navigate(banner.link);
        }
    };

    const handleConfirmNavigate = () => {
        if (banner.link) {
            window.open(banner.link, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <>
            <div 
                onClick={handleClick}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${banner.link ? 'cursor-pointer' : 'cursor-default'} ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
            >
                <picture className="w-full h-full block">
                    <source media="(max-width: 768px)" srcSet={mobileSrc} />
                    <img 
                        src={desktopSrc} 
                        alt={t(banner.alt)} 
                        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={handleLoad}
                        onError={(e) => {
                            handleError();
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.parentElement?.classList.add('bg-panel-tertiary');
                        }}
                    />
                </picture>
                
                {/** Fallback Text (Visible if image fails or hasn't loaded yet) */}
                <div className={`absolute inset-0 flex items-center justify-center -z-10 ${isLoaded ? 'hidden' : 'flex'}`}>
                    <span className="text-gray-600 font-medium tracking-widest uppercase text-xs md:text-sm">
                        {t(banner.alt)}
                    </span>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmNavigate}
                title={t('info.banner.confirmTitle')}
                description={t('info.banner.confirmDescription')}
                confirmText={t('info.banner.confirmAction')}
                cancelText={t('info.banner.cancelAction')}
                variant="info"
            >
                <div className="w-full mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center gap-2.5 text-blue-400 text-xs font-mono break-all selection:bg-blue-500/30">
                    <i className="fa-solid fa-arrow-up-right-from-square text-sm shrink-0"></i>
                    <span className="font-semibold">{banner.link}</span>
                </div>
            </ConfirmationModal>
        </>
    );
};

export default BannerSlide;
