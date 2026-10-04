import React from 'react';
import { useLocale } from '../../context/LocaleContext';
import type { FooterConfig } from '../../types';

interface FooterNavProps {
    config: Omit<FooterConfig, 'languages'>;
    onNavigate: (view: string) => void;
}

const FooterNav: React.FC<FooterNavProps> = ({ config, onNavigate }) => {
    const { t } = useLocale();

    return (
        <div className="flex gap-16 md:gap-32">
            <div>
                <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-6">
                    {t('footer.navHeader')}
                </h3>
                <ul className="space-y-3 text-sm">
                    {config.navLinks.map((linkObj, idx) => (
                        <li key={idx}>
                            <button
                                onClick={() => onNavigate(linkObj.view)}
                                className="hover:text-white transition-colors duration-200 text-left"
                            >
                                {linkObj.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-6">
                    {t('footer.userHeader')}
                </h3>
                <ul className="space-y-3 text-sm">
                    {config.userLinks.map((linkObj, idx) => (
                        <li key={idx}>
                            <button
                                onClick={() => onNavigate(linkObj.view)}
                                className="hover:text-white transition-colors duration-200 text-left"
                            >
                                {linkObj.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FooterNav;
