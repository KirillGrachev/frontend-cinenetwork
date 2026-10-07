import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { ru, en } from '../locales/translations';
import { getTranslation } from '../utils/i18n';

const locales = { ru, en };

export type TFunction = (key: string, replacements?: Record<string, string | number>) => any;

interface LocaleContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: TFunction;
  availableLocales: string[];
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState('ru');

  const t = useCallback((key: string, replacements?: Record<string, string | number>): any => {
    // Pass the current locale to the helper
    const translation = getTranslation(locales[locale as keyof typeof locales], key, replacements, locale);
    
    if (translation === undefined || translation === null) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translation;
  }, [locale]);
  
  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
    availableLocales: Object.keys(locales),
  }), [locale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};