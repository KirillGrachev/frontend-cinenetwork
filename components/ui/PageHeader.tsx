import React from 'react';

interface PageHeaderProps {
    title: string;
    description: React.ReactNode;
    isCentered?: boolean;
    actions?: React.ReactNode;
    className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    isCentered = false,
    actions,
    className = '',
}) => {
    const baseClasses = 'select-none';

    if (isCentered) {
        return (
            <div className={`mb-10 text-center ${baseClasses} ${className}`}>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{title}</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">{description}</p>
            </div>
        );
    }

    return (
        <div
            className={`mb-10 flex flex-col md:flex-row justify-between md:items-start gap-6 ${baseClasses} ${className}`}
        >
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
                <p className="text-gray-400 max-w-2xl">{description}</p>
            </div>
            {actions && <div className="flex-shrink-0">{actions}</div>}
        </div>
    );
};

export default PageHeader;
