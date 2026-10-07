
import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useLocale } from '../../context/LocaleContext';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { hasToasts } = useToast();
  const { t } = useLocale();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /** Only show if scrolled down AND no toasts are visible */
  const shouldShow = isVisible && !hasToasts;

  return (
    <button
      onClick={scrollToTop}
      aria-label={t('common.ui.backToTop')}
      className={`
        fixed right-8 z-40 w-14 h-14 rounded-full 
        bg-panel-secondary/80 backdrop-blur-xl  
        text-white shadow-[0_8px_30px_rgba(0,0,0,0.5)] 
        flex items-center justify-center leading-none
        transition-all duration-300
        hover:bg-white/10 hover:border-white/20
        active:scale-95
        bottom-24 md:bottom-8
        ${shouldShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}
    >
      <i className="fa-solid fa-arrow-up text-lg"></i>
    </button>
  );
};

export default ScrollToTopButton;
