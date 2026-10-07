
import React from 'react';
import { useNavigate } from 'react-router';
import { useFooterLogic } from '../hooks/useFooterLogic';
import FooterNav from './footer/FooterNav';
import FooterSocials from './footer/FooterSocials';

const Footer: React.FC = () => {
    const navigate = useNavigate();
    const { state, actions } = useFooterLogic((path) => navigate(path));
    const { t, locale, availableLocales, footerConfig } = state;

  return (
    // CHANGED: Added pb-24 for mobile bottom nav space, md:pb-12 for desktop
    <footer className="w-full bg-background-secondary text-gray-400 border-t border-border-light font-sans pt-16 pb-24 md:pb-12 select-none">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-24 mb-16">
          <div className="flex-1 max-w-xs">
            <div>
                <img 
                    src="/assets/logo/white-cinenetwork.png" 
                    alt={t('common.appName')} 
                    className="h-8 md:h-10 w-auto object-contain opacity-90 max-w-[240px] md:max-w-[280px]"
                />
            </div>
          </div>

          <FooterNav config={footerConfig} onNavigate={actions.handleNavClick} />
        </div>

        <div className="w-full h-px bg-white/5 mb-8"></div>

        {/* Bottom Section */}
        {/* CHANGED: items-center for mobile centering, md:items-end for desktop right alignment */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8">
          
          {/* Legal Text */}
          {/* CHANGED: text-center for mobile */}
          <div className="text-xs text-gray-500 space-y-2.5 text-center md:text-left">
            <p className="opacity-80">{footerConfig.legalText}</p>
            <p>
                {t('footer.copyrightsContact')}{' '}
                <button 
                    onClick={() => actions.handleCopyEmail(footerConfig.emails.copyright)}
                    className="text-white font-medium cursor-pointer hover:underline focus:outline-none"
                >
                    {footerConfig.emails.copyright}
                </button>
            </p>
            <p>
                {t('footer.generalContact')}{' '}
                <button 
                    onClick={() => actions.handleCopyEmail(footerConfig.emails.contact)}
                    className="text-white font-medium cursor-pointer hover:underline focus:outline-none"
                >
                    {footerConfig.emails.contact}
                </button>
            </p>
            <p className="pt-2 text-gray-600">{footerConfig.copyrightText}</p>
          </div>

          <FooterSocials 
            config={footerConfig}
            availableLocales={availableLocales}
            currentLocale={locale}
            onLocaleChange={actions.selectLang}
            onSocialClick={actions.handleSocialClick}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
