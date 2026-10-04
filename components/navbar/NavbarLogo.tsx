import React, { useState } from 'react';
import { useLocale } from '../../context/LocaleContext';

interface NavbarLogoProps {
    onClick: () => void;
}

const NavbarLogo: React.FC<NavbarLogoProps> = ({ onClick }) => {
    const { t, locale } = useLocale();
    /**
     * The brand mark is a binary asset that may be absent (fresh clone
     * without the artwork repo). Never render a broken <img>: fall back to a
     * styled wordmark on error.
     */
    const [logoFailed, setLogoFailed] = useState(false);

    return (
        <div className="flex items-center gap-4">
            {/** Logo Container */}
            <div
                className="flex items-start cursor-pointer group select-none relative"
                onClick={onClick}
            >
                {logoFailed ? (
                    <span className="h-5 md:h-6 flex items-center text-lg md:text-xl font-black uppercase italic tracking-wide bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent select-none">
                        {t('common.appName')}
                    </span>
                ) : (
                    <img
                        src="/assets/logo/white-cinenetwork.png"
                        alt={t('common.appName')}
                        onError={() => setLogoFailed(true)}
                        className="h-5 md:h-6 w-auto object-contain transition-opacity group-hover:opacity-90 max-w-[180px] md:max-w-[220px]"
                    />
                )}
                <span className="text-[10px] font-medium text-gray-400 uppercase leading-none ml-1 -mt-1.5 transition-colors group-hover:text-gray-300 select-none">
                    {locale}
                </span>
            </div>
        </div>
    );
};

export default NavbarLogo;
