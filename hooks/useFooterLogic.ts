import React from 'react';
import { useLocale } from '../context/LocaleContext';
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
      selectLang: (lang: string) => {
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
          try {
              await navigator.clipboard.writeText(email);
              showToast(t('blogPost.copied'), ToastType.Success);
          } catch (err) {
              /** Fallback for non-secure contexts or older browsers */
              const textArea = document.createElement("textarea");
              textArea.value = email;
              
              /** Ensure it's not visible but part of DOM */
              textArea.style.position = "fixed";
              textArea.style.left = "-9999px";
              textArea.style.top = "0";
              document.body.appendChild(textArea);
              
              textArea.focus();
              textArea.select();
              
              try {
                  const successful = document.execCommand('copy');
                  if (successful) {
                      showToast(t('blogPost.copied'), ToastType.Success);
                  } else {
                      showToast(t('common.toasts.copyFailed'), ToastType.Error);
                  }
              } catch (e) {
                  showToast(t('common.toasts.copyError'), ToastType.Error);
              }
              
              document.body.removeChild(textArea);
          }
      }
  };

  return {
      state: {
          t,
          locale,
          availableLocales,
          footerConfig,
      },
      actions
  };
};