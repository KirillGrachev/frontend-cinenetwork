
import React from 'react';
import { useNavigate } from 'react-router';
import PageHeader from './ui/PageHeader';
import Button from './ui/Button';
import { useSettingsLogic } from '../hooks/useSettingsLogic';
import { AppRoute, SettingsTab } from '../types';

// Sub-components
import SettingsProfile from './settings/SettingsProfile';
import SettingsPreferences from './settings/SettingsPreferences';
import SettingsPlayer from './settings/SettingsPlayer';

interface SettingsProps {
    isAuthenticated: boolean;
}

const Settings: React.FC<SettingsProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const { state, actions, register } = useSettingsLogic(isAuthenticated);
  const { activeTab, formData, isSaving, locale, availableLocales, t, errors } = state;

  const tabs = [
      { id: SettingsTab.Profile, label: t('settings.tabs.profile'), icon: 'fa-regular fa-id-card' },
      { id: SettingsTab.Preferences, label: t('settings.tabs.preferences'), icon: 'fa-solid fa-sliders' },
      { id: SettingsTab.Player, label: t('settings.tabs.player'), icon: 'fa-solid fa-play' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="mb-8">
            <Button 
                variant="ghost" 
                size="md" 
                icon="fa-solid fa-arrow-left" 
                onClick={() => navigate(AppRoute.Home)}
                className="pl-0 hover:!bg-transparent hover:text-white"
            >
                {t('navbar.backToHome')}
            </Button>
        </div>

        <PageHeader
            title={t('settings.title')}
            description={t('settings.description')}
            className="!mb-10"
        />

        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
            
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-32">
                <div className="bg-panel-primary border border-border-medium rounded-2xl p-2 flex flex-col gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => actions.setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                activeTab === tab.id 
                                ? 'bg-white text-black shadow-sm' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <i className={`${tab.icon} w-5 text-center`}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
                {activeTab === SettingsTab.Profile && (
                    <SettingsProfile 
                        formData={formData} 
                        isSaving={isSaving} 
                        register={register}
                        errors={errors}
                        saveChanges={actions.saveChanges} 
                    />
                )}

                {activeTab === SettingsTab.Preferences && (
                    <SettingsPreferences 
                        locale={locale}
                        availableLocales={availableLocales}
                        setLocale={actions.setLocale}
                    />
                )}

                {activeTab === SettingsTab.Player && (
                    <SettingsPlayer />
                )}
            </div>

        </div>

      </div>
    </div>
  );
};

export default Settings;
