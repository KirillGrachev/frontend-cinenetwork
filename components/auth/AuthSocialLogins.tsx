import React from 'react';
import { AUTH_CONFIG } from '../../constants';
import { useLocale } from '../../context/LocaleContext';

const AuthSocialLogins: React.FC = () => {
  const { t } = useLocale();
  return (
    <>
      <div className="relative flex py-4 items-center">
        <div className="flex-grow border-t border-border-medium"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-xs">{t('auth.socialLogin')}</span>
        <div className="flex-grow border-t border-border-medium"></div>
      </div>
      <div className="flex gap-3 justify-center">
        {AUTH_CONFIG.socialProviders.map((icon, idx) => {
          /** Check if it's the Yandex icon to apply extra weight */
          const isYandex = icon.includes('yandex');
          
          return (
            <button
              key={idx}
              className="w-12 h-12 rounded-xl bg-item-primary border border-border-medium hover:bg-item-secondary hover:text-white text-gray-400 transition-all duration-300 flex items-center justify-center text-xl"
            >
              {/** Using text-shadow to visually thicken the font icon without breaking font-family bindings */}
              <i className={`${icon} ${isYandex ? '[text-shadow:0_0_1px_currentColor]' : ''}`}></i>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default AuthSocialLogins;