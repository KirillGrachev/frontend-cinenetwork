
import React, { useState } from 'react';
import Checkbox from '../ui/Checkbox';
import { useLocale } from '../../context/LocaleContext';

interface SettingsPreferencesProps {
  locale: string;
  availableLocales: string[];
  setLocale: (locale: string) => void;
}

const SettingsPreferences: React.FC<SettingsPreferencesProps> = ({ 
    locale, 
    availableLocales, 
    setLocale 
}) => {
  const { t } = useLocale();
  
  // Mock local state for settings (simulating stored prefs)
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [notifyReleases, setNotifyReleases] = useState(true);
  const [notifyNews, setNotifyNews] = useState(true);
  const [notifyMentions, setNotifyMentions] = useState(true);

  return (
    <div className="space-y-8 animate-fade-in">
       
       {/* Language */}
       <div className="space-y-4 bg-panel-primary p-6 rounded-2xl ">
            <h3 className="text-lg font-bold text-white mb-4">{t('settings.preferences.interfaceLanguage')}</h3>
            <div className="flex gap-3">
                {availableLocales.map((langKey) => (
                    <button 
                        key={langKey}
                        onClick={() => setLocale(langKey)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${locale === langKey ? 'bg-white text-black border-white' : 'bg-item-primary text-gray-400 border-border-medium hover:border-border-focus'}`}
                    >
                        {t(`languages.${langKey}`)}
                    </button>
                ))}
            </div>
       </div>

       {/* Content & Interface */}
       <div className="space-y-4 bg-panel-primary p-6 rounded-2xl ">
         <div className="space-y-4">
            <div className="flex items-start justify-between">
                <div className="mr-4">
                    <span className="text-white font-medium block">{t('settings.preferences.showSpoilers')}</span>
                    <p className="text-gray-500 text-xs mt-1">{t('settings.preferences.showSpoilersDesc')}</p>
                </div>
                <Checkbox 
                    label="" 
                    checked={showSpoilers} 
                    onChange={setShowSpoilers} 
                />
            </div>
         </div>
       </div>

       {/* Notifications */}
       <div className="space-y-4 bg-panel-primary p-6 rounded-2xl ">
         <h3 className="text-lg font-bold text-white mb-4">{t('settings.preferences.notifications')}</h3>
         <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">{t('settings.preferences.notifyReleases')}</span>
                <Checkbox label="" checked={notifyReleases} onChange={setNotifyReleases} />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">{t('settings.preferences.notifyMentions')}</span>
                <Checkbox label="" checked={notifyMentions} onChange={setNotifyMentions} />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">{t('settings.preferences.notifyNews')}</span>
                <Checkbox label="" checked={notifyNews} onChange={setNotifyNews} />
            </div>
         </div>
       </div>
    </div>
  );
};

export default SettingsPreferences;
