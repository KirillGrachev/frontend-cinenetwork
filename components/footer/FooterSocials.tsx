
import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FooterConfig } from '../../types';
import { useLocale } from '../../context/LocaleContext';

interface FooterSocialsProps {
    config: Omit<FooterConfig, 'languages'>;
    availableLocales: string[];
    currentLocale: string;
    onLocaleChange: (lang: string) => void;
    onSocialClick: (e: React.MouseEvent) => void;
}

const FooterSocials: React.FC<FooterSocialsProps> = ({ 
    config, 
    availableLocales, 
    currentLocale, 
    onLocaleChange, 
    onSocialClick,
}) => {
    const { t } = useLocale();

    // Common style for all buttons in this row
    const buttonClasses = "w-12 h-12 bg-item-primary rounded-xl flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300 shadow-md focus:outline-none";

    return (
        <div className="flex flex-nowrap justify-center sm:justify-end items-center gap-3">
            {/* Language Selector (Square Button with Dropdown) */}
            <Menu as="div" className="relative flex-shrink-0">
                <Menu.Button 
                    aria-label={t('settings.preferences.interfaceLanguage')}
                    className={`${buttonClasses} font-bold text-xs uppercase tracking-wide`}
                >
                    {currentLocale}
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute bottom-full left-0 sm:left-auto sm:right-0 mb-2 w-40 bg-panel-primary border border-border-medium rounded-xl shadow-xl overflow-hidden z-50 origin-bottom-left sm:origin-bottom-right focus:outline-none">
                        <div className="p-1">
                            {availableLocales.map((lang) => (
                                <Menu.Item key={lang}>
                                    {({ active }) => (
                                        <button
                                            onClick={() => onLocaleChange(lang)}
                                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-between ${
                                                active ? 'bg-white/10 text-white' : 'text-gray-400'
                                            } ${currentLocale === lang ? 'text-white' : ''}`}
                                        >
                                            <span>{t(`languages.${lang}`)}</span>
                                            {currentLocale === lang && <i className="fa-solid fa-check text-xs"></i>}
                                        </button>
                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>

            {/* Social Links */}
            {config.socialLinks.map((social, idx) => {
                if (social.href && social.href !== '#') {
                    return (
                        <a 
                            key={idx}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${t('footer.followUsOn')} ${social.label}`}
                            className={`${buttonClasses} flex-shrink-0`}
                        >
                            <i className={`${social.icon} text-lg`}></i>
                        </a>
                    );
                }
                
                return (
                    <button 
                        key={idx} 
                        onClick={onSocialClick}
                        aria-label={`${t('footer.followUsOn')} ${social.label}`}
                        className={`${buttonClasses} flex-shrink-0`}
                    >
                        <i className={`${social.icon} text-lg`}></i>
                    </button>
                );
            })}
        </div>
    );
};

export default FooterSocials;
