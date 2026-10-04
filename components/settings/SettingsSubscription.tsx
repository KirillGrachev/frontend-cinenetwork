import React from 'react';
import Button from '../ui/Button';
import type { UserSettings } from '../../types';
import { useLocale } from '../../context/LocaleContext';

interface SettingsSubscriptionProps {
    formData: Partial<UserSettings>;
}

const SettingsSubscription: React.FC<SettingsSubscriptionProps> = ({ formData }) => {
    const { t } = useLocale();

    return (
        <div className="page-reveal">
            <div className="bg-panel-primary border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">
                            {t('settings.subscription.currentPlan')}
                        </h3>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold text-white">
                                {t('settings.subscription.premium')}
                            </h2>
                            {formData.isPremium && (
                                <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-1 rounded border border-orange-500/20">
                                    {t('common.ui.active')}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-400 text-sm">
                            {t('settings.subscription.activeUntil', { date: '15 Марта, 2026' })}
                        </p>
                    </div>
                    <Button variant="secondary" icon="fa-solid fa-credit-card">
                        {t('settings.subscription.manage')}
                    </Button>
                </div>
                <div className="mt-8 pt-8 border-t border-border-light">
                    <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
                        {t('settings.subscription.benefits')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsSubscription;
