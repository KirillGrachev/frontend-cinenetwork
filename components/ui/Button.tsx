import React, { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'glass' | 'ghost' | 'black' | 'soft';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
    as?: React.ElementType;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: string;
    iconPosition?: 'left' | 'right';
    className?: string;
    children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement> &
    React.ComponentPropsWithoutRef<'button'> &
    React.ComponentPropsWithoutRef<'a'>;

const Button = forwardRef<HTMLElement, ButtonProps>(
    (
        {
            as,
            children,
            variant = 'primary',
            size = 'md',
            icon,
            iconPosition = 'left',
            className = '',
            ...props
        },
        ref,
    ) => {
        const Component = as || 'button';

        // CHANGED: Removed active:scale-[0.98], added active:scale-[0.98] for feedback
        const baseStyles =
            'inline-flex items-center justify-center font-bold whitespace-nowrap transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-xl';

        const variants: Record<ButtonVariant, string> = {
            primary: 'bg-white text-black hover:bg-gray-200 border border-transparent',
            secondary:
                'bg-panel-primary/80 backdrop-blur-xl text-white border border-border-medium hover:bg-white/20',
            glass: 'bg-black/40 backdrop-blur-xl border border-border-medium text-gray-300 hover:text-white',
            ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5',
            black: 'bg-panel-primary border border-border-medium text-white hover:bg-white hover:text-black shadow-lg',
            soft: 'bg-white/10 border border-white/10 text-white hover:bg-white/20 hover:border-white/30',
        };

        const sizes: Record<ButtonSize, string> = {
            sm: 'h-10 px-5 text-xs',
            md: 'h-12 px-7 text-sm',
            lg: 'h-14 px-9 text-base',
        };

        return (
            <Component
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            >
                {/** Icon Left - Wrapped in fixed width flex container to prevent jumping */}
                {icon && iconPosition === 'left' && (
                    <span
                        className={`inline-flex items-center justify-center w-5 h-5 flex-shrink-0 ${children ? 'mr-2' : ''}`}
                    >
                        <i className={`${icon} text-[1.1em] leading-none`}></i>
                    </span>
                )}

                {/** Text Wrapper for alignment */}
                {children && <span>{children}</span>}

                {/** Icon Right */}
                {icon && iconPosition === 'right' && (
                    <span
                        className={`inline-flex items-center justify-center w-5 h-5 flex-shrink-0 ${children ? 'ml-2' : ''}`}
                    >
                        <i className={`${icon} text-[1.1em] leading-none`}></i>
                    </span>
                )}
            </Component>
        );
    },
);

export default Button;
