
import { useState, useEffect, RefObject } from 'react';

export const useScrollSpy = (
    sectionIds: string[], 
    offset: number = 100,
    isManualOverride: RefObject<boolean>
) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // If no sections or already manually scrolling, skip
    if (sectionIds.length === 0) return;

    const handleScroll = () => {
        if (isManualOverride.current) return;

        let currentSectionId = activeId;

        // Check positions
        for (let i = 0; i < sectionIds.length; i++) {
            const id = sectionIds[i];
            const element = document.getElementById(id);
            if (element) {
                const rect = element.getBoundingClientRect();
                // If element is near top of viewport
                if (rect.top < offset && rect.top > -rect.height) {
                    currentSectionId = id;
                } 
                // Fallback: if we are at the very bottom of page, highlight last item
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 20) {
                     currentSectionId = sectionIds[sectionIds.length - 1];
                }
            }
        }
        
        if (currentSectionId !== activeId) {
            setActiveId(currentSectionId);
        }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, activeId, offset, isManualOverride]);

  return { activeId, setActiveId };
};
