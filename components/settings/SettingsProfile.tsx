
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import LoadingSpinner from '../LoadingSpinner';
import SocialLinkItem from './SocialLinkItem';
import { UserSettings, SocialProviderId } from '../../types';
import { useLocale } from '../../context/LocaleContext';
import { ProfileFormValues } from '../../utils/validationSchemas';

interface SettingsProfileProps {
  formData: Partial<UserSettings> & { bio?: string };
  isSaving: boolean;
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  saveChanges: () => void;
}

const SettingsProfile: React.FC<SettingsProfileProps> = ({ 
    formData, 
    isSaving, 
    register,
    errors,
    saveChanges 
}) => {
  const { t } = useLocale();
  
  const socialAccounts = [
      { id: SocialProviderId.Google, name: t('settings.profile.socials.google'), icon: 'fa-brands fa-google', connected: true },
      { id: SocialProviderId.Telegram, name: t('settings.profile.socials.telegram'), icon: 'fa-brands fa-telegram', connected: false },
      { id: SocialProviderId.Discord, name: t('settings.profile.socials.discord'), icon: 'fa-brands fa-discord', connected: false },
      { id: SocialProviderId.Yandex, name: t('settings.profile.socials.yandex'), icon: 'fa-brands fa-yandex', connected: false },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-item-primary border-2 border-border-medium flex items-center justify-center relative group cursor-pointer overflow-hidden">
             {formData.avatarUrl ? (
                 <img src={formData.avatarUrl} alt={t('settings.profile.avatarAlt')} className="w-full h-full object-cover" />
             ) : (
                 <span className="text-3xl font-bold text-gray-500">{formData.username?.charAt(0).toUpperCase()}</span>
             )}
             <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fa-solid fa-camera text-white"></i>
             </div>
        </div>
        <div>
            <h3 className="text-xl font-bold text-white mb-1">{formData.username}</h3>
            <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">{t('settings.profile.changeAvatar')}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-2 relative">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t('settings.profile.username')}</label>
            <Input 
                {...register('username')}
                error={errors.username?.message}
            />
         </div>
         <div className="space-y-2 relative">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t('settings.profile.email')}</label>
            <Input 
                {...register('email')}
                type="email"
                error={errors.email?.message}
            />
         </div>
         
         <div className="space-y-2 relative md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t('settings.profile.bio')}</label>
            <TextArea 
                {...register('bio')}
                placeholder={t('settings.profile.bioPlaceholder')}
                className="bg-item-primary "
            />
         </div>
      </div>

      {/** Social Accounts Section */}
      <div className="bg-panel-primary p-6 rounded-2xl ">
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">{t('settings.profile.linkedAccounts')}</h3>
          <div className="space-y-3">
              {socialAccounts.map(account => (
                  <SocialLinkItem 
                    key={account.id}
                    account={account}
                    onConnect={() => console.log('Connect', account.id)}
                    onDisconnect={() => console.log('Disconnect', account.id)}
                  />
              ))}
          </div>
      </div>

      <div className="pt-4 border-t border-border-light">
        <Button variant="primary" onClick={saveChanges} disabled={isSaving} className="w-full md:w-auto min-w-[200px]">
            {isSaving ? <LoadingSpinner size="sm" className="w-5 h-5 border-black/20 border-t-black" /> : t('settings.profile.saveChanges')}
        </Button>
      </div>
    </div>
  );
};

export default SettingsProfile;
