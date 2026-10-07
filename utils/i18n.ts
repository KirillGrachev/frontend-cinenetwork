/** Helper to determine plural category based on locale */
const getPluralCategory = (count: number, locale: string): 'one' | 'few' | 'many' | 'other' => {
  if (locale === 'ru') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    
    if (mod10 === 1 && mod100 !== 11) {
      return 'one';
    }
    if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) {
      return 'few';
    }
    return 'many';
  }
  
  /** Default (English and others) */
  return count === 1 ? 'one' : 'other';
};

/** Helper to get nested values from an object using a string path (e.g., 'navbar.home') */
/** It also handles replacements like t('key', { name: 'World' }) -> "Hello World" */
/** Supports pluralization if value is an object and `count` is present in replacements or as a 3rd arg. */
export const getTranslation = (
    obj: any, 
    path: string, 
    replacements?: Record<string, string | number>,
    locale: string = 'en'
): any => {
  let value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
  
  /** Check for pluralization */
  /** We look for 'count' or 'mins' (specific for timeLeft case) in replacements to drive logic */
  let count: number | undefined;
  
  if (replacements) {
      if (typeof replacements.count === 'number') count = replacements.count;
      else if (typeof replacements.mins === 'number') count = replacements.mins;
  }

  /** If the translation value is an object (contains plural forms) and we have a count */
  if (value && typeof value === 'object' && count !== undefined) {
      const category = getPluralCategory(count, locale);
      /** Fallbacks: specific category -> 'other' -> 'many' -> first key */
      value = value[category] || value['other'] || value['many'] || Object.values(value)[0];
  }

  if (typeof value === 'string' && replacements) {
    return Object.entries(replacements).reduce((acc, [key, val]) => {
      return acc.replace(`{${key}}`, String(val));
    }, value);
  }
  
  return value;
};

/** Helper for compact number formatting (e.g. 1.5k or 1,5 тыс.) */
export const formatCompactNumber = (number: number, locale: string = 'en'): string => {
    return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(number);
};