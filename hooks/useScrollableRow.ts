import { useRef, useState, useEffect, useCallback } from 'react';

const SCROLL_RATIO = 0.8;
const SCROLL_THRESHOLD = 5; /** Pixel buffer for scroll detection accuracy */

export const useScrollableRow = () => {
    const rowRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = useCallback(() => {
        if (rowRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
            setCanScrollLeft(scrollLeft > SCROLL_THRESHOLD);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - SCROLL_THRESHOLD);
        }
    }, []);

    useEffect(() => {
        const element = rowRef.current;
        if (!element) return;

        checkScroll();
        const timeout = setTimeout(checkScroll, 500); /** Check after potential image load */

        window.addEventListener('resize', checkScroll);
        element.addEventListener('scroll', checkScroll, { passive: true });

        return () => {
            window.removeEventListener('resize', checkScroll);
            element.removeEventListener('scroll', checkScroll);
            clearTimeout(timeout);
        };
    }, [checkScroll]);

    const scroll = (direction: 'left' | 'right') => {
        if (rowRef.current) {
            const { current } = rowRef;
            const scrollAmount = current.clientWidth * SCROLL_RATIO;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return { rowRef, canScrollLeft, canScrollRight, scroll };
};
