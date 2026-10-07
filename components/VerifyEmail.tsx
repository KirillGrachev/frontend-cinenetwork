
import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import Input from './ui/Input';
import Button from './ui/Button';
import AuthFormWrapper from './auth/AuthFormWrapper';
import { useLocale } from '../context/LocaleContext';
import { useVerifyEmail } from '../hooks/useAuthForms';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { AppRoute } from '../types';
import SEO from './SEO';

const VerifyEmail: React.FC = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const email = location.state?.email || 'email@example.com';

  const onVerifySuccess = async () => {
      // Upon successful verification, log the user in automatically
      await login();
      navigate(AppRoute.Profile);
  };

  const { state, actions, register } = useVerifyEmail(email, onVerifySuccess);
  const { timer, isSubmitting, errors } = state;

  return (
    <>
        <SEO title={t('auth.verify.title')} />
        <AuthFormWrapper
            title={t('auth.verify.title')}
            footerLinkText=""
            footerLinkActionText={t('auth.recovery.backToLogin')}
            onFooterLinkClick={() => navigate(AppRoute.Login)}
        >
            <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                    <i className="fa-regular fa-envelope text-2xl text-blue-400"></i>
                </div>
                <p className="text-gray-400 text-sm">
                    {t('auth.verify.description', { email })}
                </p>
            </div>

            <form onSubmit={actions.submit} className="space-y-6">
                <Input 
                    {...register('code')}
                    placeholder={t('auth.verify.codePlaceholder')}
                    className="text-center tracking-[1em] font-bold text-lg h-14"
                    maxLength={6}
                    error={errors.code?.message}
                    autoFocus
                />
                
                <Button variant="primary" type="submit" className="w-full h-12" disabled={isSubmitting}>
                    {isSubmitting 
                        ? <LoadingSpinner size="sm" className="w-5 h-5 border-black/20 border-t-black" />
                        : t('auth.verify.submit')
                    }
                </Button>

                {/* Removed mt-4/!mt-4 to let space-y-6 handle spacing naturally */}
                <div className="text-center">
                    {timer > 0 ? (
                        <p className="text-xs text-gray-500">{t('auth.recovery.resendIn', { seconds: timer })}</p>
                    ) : (
                        <button 
                            type="button"
                            onClick={actions.resendCode}
                            className="text-xs text-white hover:underline font-medium transition-all"
                        >
                            {t('auth.recovery.resendCode')}
                        </button>
                    )}
                </div>
            </form>
        </AuthFormWrapper>
    </>
  );
};

export default VerifyEmail;
