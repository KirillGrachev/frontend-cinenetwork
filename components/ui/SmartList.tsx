import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import type { VirtuosoProps } from 'react-virtuoso';

/** Virtuoso props SmartList manages itself are excluded from the pass-through. */
type VirtuosoPassThrough<T> = Partial<
    Omit<VirtuosoProps<T, undefined>, 'data' | 'totalCount' | 'itemContent' | 'className' | 'style'>
>;

export interface SmartListProps<T = unknown> extends VirtuosoPassThrough<T> {
    totalCount?: number;
    data?: T[];
    itemContent: (index: number, data: T | undefined) => React.ReactNode;
    /** Below this item count a plain map is cheaper than virtualisation. */
    threshold?: number;
    className?: string;
    style?: React.CSSProperties;
}

const SmartList = <T,>({
    totalCount,
    data,
    itemContent,
    threshold = 150,
    className,
    style,
    ...rest
}: SmartListProps<T>) => {
    const count = data ? data.length : (totalCount ?? 0);

    // Use regular mapping if item count is below threshold
    if (count < threshold) {
        return (
            <div className={className} style={style}>
                {Array.from({ length: count }).map((_, index) => (
                    <React.Fragment key={index}>
                        {itemContent(index, data ? data[index] : undefined)}
                    </React.Fragment>
                ))}
            </div>
        );
    }

    // Use Virtuoso for large lists, passing data OR totalCount cleanly
    if (data) {
        return (
            <Virtuoso
                data={data}
                itemContent={(index, item) => itemContent(index, item)}
                className={className}
                style={style}
                {...rest}
            />
        );
    }

    return (
        <Virtuoso
            totalCount={totalCount}
            itemContent={(index) => itemContent(index, undefined)}
            className={className}
            style={style}
            {...rest}
        />
    );
};

export default SmartList;
