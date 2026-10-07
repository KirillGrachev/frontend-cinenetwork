import React, { useRef, useState, useCallback } from 'react';

export const useDraggableScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    setIsDown(true);
    setIsDragging(false);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsDown(false);
    setIsDragging(false);
  }, []);

  const onMouseUp = useCallback(() => {
    setIsDown(false);
    setIsDragging(false);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDown || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5; /** Scroll-fast multiplier */
    
    /** Only activate dragging state if moved significantly (prevent accidental drag on click) */
    if (Math.abs(x - startX) > 5) {
        if (!isDragging) setIsDragging(true);
        ref.current.scrollLeft = scrollLeft - walk;
    }
  }, [isDown, isDragging, startX, scrollLeft]);

  return {
    ref,
    events: {
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onMouseMove
    },
    isDragging,
    isDown
  };
};