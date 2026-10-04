import React from 'react';
import { useLocale } from '../../context/LocaleContext';

interface NavbarLogoProps {
    onClick: () => void;
}

const NavbarLogo: React.FC<NavbarLogoProps> = ({ onClick }) => {
    const { t, locale } = useLocale();

    return (
        <div className="flex items-center gap-4">
            {/** Logo Container */}
            <div
                className="flex items-start cursor-pointer group select-none relative"
                onClick={onClick}
            >
                <img
                    src="/assets/logo/white-cinenetwork.png"
                    alt={t('common.appName')}
                    className="h-5 md:h-6 w-auto object-contain transition-opacity group-hover:opacity-90 max-w-[180px] md:max-w-[220px]"
                />
                <span className="text-[10px] font-medium text-gray-400 uppercase leading-none ml-1 -mt-1.5 transition-colors group-hover:text-gray-300 select-none">
                    {locale}
                </span>
            </div>
        </div>
    );
};

export default NavbarLogo;
