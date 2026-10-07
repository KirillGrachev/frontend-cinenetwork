import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const isFirstMount = useRef(true);

  // Save scroll position on scroll
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(`scroll-${pathname}`, window.scrollY.toString());
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      const savedScroll = sessionStorage.getItem(`scroll-${pathname}`);
      if (savedScroll) {
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedScroll, 10),
            left: 0,
            behavior: "instant"
          });
        }, 100);
      }
      return;
    }
    
    // On subsequent navigations, scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;