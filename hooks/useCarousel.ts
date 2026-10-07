import { useState, useEffect, useCallback } from 'react';

export const useCarousel = (length: number, interval: number = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % length);
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, length, interval]);

  const handlers = {
      onMouseEnter: () => setIsPaused(true),
      onMouseLeave: () => setIsPaused(false)
  };

  return {
    currentIndex,
    setCurrentIndex,
    handlers
  };
};