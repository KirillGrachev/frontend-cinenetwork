import type React from 'react';
import { useLocale } from '../context/LocaleContext';
import { copyToClipboard } from '../utils/clipboard';
import type { Locale } from '../context/LocaleContext';
import { useToast } from '../context/ToastContext';
import { getFooterConfig } from '../constants';
import { AppView, ToastType, AppRoute } from '../types';

const viewToPathMap: Record<string, string> = {
    [AppView.Home]: AppRoute.Home,
    [AppView.Catalog]: AppRoute.Catalog,
    [AppView.Schedule]: AppRoute.Schedule,
    [AppView.News]: AppRoute.News,
    [AppView.Docs]: `${AppRoute.Docs}/agreement`,
    [AppView.Login]: AppRoute.Login,
    [AppView.Register]: AppRoute.Register,
    [AppView.Settings]: AppRoute.Settings,
    [AppView.Status]: AppRoute.Status,
    [AppView.Support]: AppRoute.Support,
};

export const useFooterLogic = (onNavigate?: (path: string) => void) => {
    const { t, locale, setLocale, availableLocales } = useLocale();
    const { showToast } = useToast();
    const footerConfig = getFooterConfig(t);

    const actions = {
        selectLang: (lang: Locale) => {
            setLocale(lang);
        },
        handleNavClick: (viewName: string) => {
            const path = viewToPathMap[viewName];
            if (onNavigate && path) {
                onNavigate(path);
            }
        },
        handleSocialClick: (e: React.MouseEvent) => {
            e.preventDefault();
            showToast(t('toasts.socialsUnavailable'), ToastType.Info);
        },
        handleCopyEmail: async (email: string) => {
            const ok = await copyToClipboard(email);
            if (ok) {
                showToast(t('blogPost.copied'), ToastType.Success);
            } else {
                showToast(t('common.toasts.copyFailed'), ToastType.Error);
            }
        },
    };

    return {
        state: {
            t,
            locale,
            availableLocales,
            footerConfig,
        },
        actions,
    };
};
