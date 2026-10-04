import React from 'react';
import { useLocale } from '../../context/LocaleContext';
import type { SocialProviderId } from '../../types';

interface SocialAccount {
    id: SocialProviderId;
    name: string;
    icon: string;
    connected: boolean;
}

interface SocialLinkItemProps {
    account: SocialAccount;
    onConnect: () => void;
    onDisconnect: () => void;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({ account, onConnect, onDisconnect }) => {
    const { t } = useLocale();

    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-item-primary ">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300">
                    <i className={`${account.icon} text-lg`}></i>
                </div>
                <span className="font-medium text-sm text-white">{account.name}</span>
            </div>

            {account.connected ? (
                <div className="flex items-center gap-4">
                    {/* CHANGED: rounded-md -> rounded-full */}
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
                        {t('common.ui.connected')}
                    </span>
                    <button
                        onClick={onDisconnect}
                        className="text-gray-500 hover:text-red-400 transition-colors text-xs font-bold"
                        aria-label={t('settings.profile.disconnectSocial', {
                            provider: account.name,
                        })}
                    >
                        <i className="fa-solid fa-link-slash"></i>
                    </button>
                </div>
            ) : (
                <button
                    onClick={onConnect}
                    className="text-xs font-bold text-blue-400 hover:text-white transition-colors bg-blue-500/10 hover:bg-blue-500 px-3 py-1.5 rounded-xl border border-blue-500/20"
                    aria-label={t('settings.profile.connectSocial', { provider: account.name })}
                >
                    {t('common.ui.connect')}
                </button>
            )}
        </div>
    );
};

export default SocialLinkItem;
