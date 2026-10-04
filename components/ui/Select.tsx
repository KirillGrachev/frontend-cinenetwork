import React, { useMemo } from 'react';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Field,
    Label,
} from '@headlessui/react';
import { useLocale } from '../../context/LocaleContext';

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    label?: string;
    value: string | undefined;
    onChange: (value: string) => void;
    options: (string | SelectOption)[];
    placeholder?: string;
    className?: string;
    variant?: 'solid' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    prefixIcon?: string;
    direction?: 'top' | 'bottom';
}

const Select: React.FC<SelectProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder,
    className = '',
    variant = 'solid',
    size = 'sm',
    prefixIcon,
    direction = 'bottom',
}) => {
    const { t } = useLocale();

    /** Normalize options */
    const normalizedOptions = useMemo(() => {
        return options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt));
    }, [options]);

    const selectedOption = normalizedOptions.find((o) => o.value === value);

    /** Styles */
    const baseButtonStyles =
        'relative w-full rounded-xl flex justify-between items-center transition-colors duration-150 focus:outline-none focus-visible:outline-none data-[focus]:outline-none data-[focus]:ring-0 select-none';

    const sizes = {
        sm: 'h-10 px-3 text-xs',
        md: 'h-12 px-4 text-sm',
        lg: 'h-14 px-5 text-base',
    };

    const iconSizes = {
        sm: { container: 'w-4 h-4', icon: 'text-[11px]' },
        md: { container: 'w-5 h-5', icon: 'text-sm' },
        lg: { container: 'w-6 h-6', icon: 'text-base' },
    };

    const currentIconSize = iconSizes[size];
    const optionTextSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    return (
        <Field className={`relative ${className}`}>
            {label && (
                <Label className="text-xs font-semibold text-gray-400 mb-1.5 block cursor-default">
                    {label}
                </Label>
            )}
            <Listbox value={value} onChange={onChange}>
                {({ open }) => (
                    <>
                        <ListboxButton
                            className={`${baseButtonStyles} ${sizes[size]} ${
                                variant === 'solid'
                                    ? `bg-item-primary border ${open ? 'border-border-medium bg-panel-tertiary' : 'border-border-medium hover:bg-panel-tertiary'}`
                                    : `bg-transparent border border-transparent ${open ? 'bg-item-primary border-border-medium text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
                            }`}
                        >
                            <div className="flex items-center gap-2.5 truncate flex-1">
                                {prefixIcon && (
                                    <div
                                        className={`${currentIconSize.container} flex items-center justify-center flex-shrink-0 ${selectedOption ? 'text-white' : 'text-gray-500'}`}
                                    >
                                        <i className={`${prefixIcon} ${currentIconSize.icon}`}></i>
                                    </div>
                                )}
                                <span
                                    className={`font-medium truncate ${selectedOption ? 'text-white' : 'text-gray-500'}`}
                                >
                                    {selectedOption
                                        ? selectedOption.label
                                        : placeholder || t('common.ui.ellipsis')}
                                </span>
                            </div>
                            <i
                                className={`fa-solid fa-chevron-down text-xs text-gray-500 flex-shrink-0 transition-transform duration-300 ml-2 ${open ? 'rotate-180' : ''}`}
                            ></i>
                        </ListboxButton>

                        <ListboxOptions
                            anchor={{
                                to: direction === 'top' ? 'top start' : 'bottom start',
                                gap: 6,
                            }}
                            className={`
                            w-[var(--button-width)] min-w-[140px] 
                            bg-panel-primary border border-border-medium rounded-xl 
                            shadow-[0_15px_45px_rgba(0,0,0,0.85)] z-[200] 
                            overflow-y-auto focus:outline-none custom-scrollbar p-1.5 
                            !max-h-[200px]
                        `}
                        >
                            {normalizedOptions.map((opt) => (
                                <ListboxOption
                                    key={opt.value}
                                    value={opt.value}
                                    className={`
                                    relative cursor-pointer select-none px-4 py-2.5 flex items-center justify-between transition-colors rounded-lg
                                    ${optionTextSizes[size]}
                                    data-[focus]:bg-white/10 data-[focus]:text-white data-[selected]:font-bold text-gray-400
                                `}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? 'text-white' : ''}`}
                                            >
                                                {opt.label}
                                            </span>
                                            {selected && (
                                                <i className="fa-solid fa-check text-[10px] text-white"></i>
                                            )}
                                        </>
                                    )}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </>
                )}
            </Listbox>
        </Field>
    );
};

export default Select;
