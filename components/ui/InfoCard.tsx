import React from 'react';

/** Polymorphic props definition */
type InfoCardProps<E extends React.ElementType> = {
    title: string;
    children: React.ReactNode;
    as?: E;
    className?: string;
    /** Props specific to interactive cards (like buttons or links) */
    /** onClick is already part of React.ComponentPropsWithoutRef<E> but usually inferred */
} & React.ComponentPropsWithoutRef<E>;

const InfoCard = <E extends React.ElementType = 'div'>({
    title,
    children,
    as,
    className = '',
    ...props
}: InfoCardProps<E>) => {
    const Component = as || 'div';

    /** Determine if the component is interactive based on the tag or props */
    /** If it's a button, anchor, or has onClick/href, treat as interactive */
    const isInteractive =
        as === 'button' ||
        as === 'a' ||
        !!('onClick' in props) ||
        !!('href' in props) ||
        !!('to' in props);

    const baseClasses = `bg-[#111] border border-white/5 rounded-3xl p-6 h-full text-left relative group block w-full`;
    // CHANGED: Removed active:scale-[0.98], added active:opacity-90
    const interactiveClasses = `transition-all duration-300 hover:border-white/10 hover:bg-[#161616] active:opacity-90 cursor-pointer`;

    return (
        <Component
            className={`${baseClasses} ${isInteractive ? interactiveClasses : ''} ${className}`}
            {...props}
        >
            <div className="flex flex-col justify-between h-full">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-white">{title}</h3>
                        {/** Show arrow only on interactive cards */}
                        {isInteractive && (
                            <i className="fa-solid fa-arrow-right text-gray-600 transition-all duration-300 transform -rotate-45 group-hover:rotate-0 group-hover:text-white"></i>
                        )}
                    </div>
                    {children}
                </div>
            </div>
        </Component>
    );
};

export default InfoCard;
