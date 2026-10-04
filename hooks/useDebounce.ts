import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Установить таймер, который обновит значение после задержки
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Очистить таймер, если значение изменилось (например, пользователь продолжает печатать)
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Перезапускать эффект только если значение или задержка изменились

    return debouncedValue;
}
