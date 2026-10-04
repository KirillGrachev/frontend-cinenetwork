import { useState, useCallback } from 'react';

export const useImageLoading = (initialSrc: string) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    /** We manage currentSrc to allow cache-busting logic for retries */
    const [currentSrc, setCurrentSrc] = useState(initialSrc);

    /**
     * Reset state when the `src` prop changes (component reuse for a different
     * entity). Render-phase adjustment per the React docs — an effect here
     * would paint one stale frame and cascade renders.
     */
    const [prevSrc, setPrevSrc] = useState(initialSrc);
    if (prevSrc !== initialSrc) {
        setPrevSrc(initialSrc);
        setIsLoaded(false);
        setHasError(false);
        setCurrentSrc(initialSrc);
    }

    const handleLoad = useCallback(() => {
        setIsLoaded(true);
        setHasError(false);
    }, []);

    const handleError = useCallback(() => {
        setIsLoaded(false);
        setHasError(true);
    }, []);

    const retry = useCallback(() => {
        setIsLoaded(false);
        setHasError(false);
        /** Append a unique timestamp to force the browser to re-fetch the image */
        /** bypassing the cache that might store the 404/error response. */
        const separator = initialSrc.includes('?') ? '&' : '?';
        setCurrentSrc(`${initialSrc}${separator}retry=${Date.now()}`);
    }, [initialSrc]);

    return {
        isLoaded,
        hasError,
        currentSrc,
        handleLoad,
        handleError,
        retry,
    };
};
