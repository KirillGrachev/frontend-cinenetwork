import { useRef, useEffect } from 'react';
import { useSearchStore } from '../store/searchStore';

export const useNavbarLogic = () => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const isSearchOpen = useSearchStore((state) => state.isSearchOpen);

    /** Auto-focus search input when opened */
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 200);
        }
    }, [isSearchOpen]);

    return {
        state: {
            searchInputRef,
        },
    };
};
