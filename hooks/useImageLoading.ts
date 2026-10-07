import { useState, useEffect, useCallback } from 'react';

export const useImageLoading = (initialSrc: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  /** We manage currentSrc to allow cache-busting logic for retries */
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  /** Reset state if the prop src changes (e.g., reusing component for different anime) */
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setCurrentSrc(initialSrc);
  }, [initialSrc]);

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
    retry
  };
};