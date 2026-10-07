
import React from 'react';
import { useNavigate } from 'react-router';
import Input from './ui/Input';
import Button from './ui/Button';
import AuthFormWrapper from './auth/AuthFormWrapper';
import { useLocale } from '../context/LocaleContext';
import { useRegistrationLogic } from '../hooks/useAuthForms';
import LoadingSpinner from './LoadingSpinner';
import { AppRoute } from '../types';
import SEO from './SEO';

const Registration: React.FC = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const { state, actions, register } = useRegistrationLogic();

  return (
    <>
        <SEO title={t('auth.register')} />
        <AuthFormWrapper
        title={t('auth.register')}
        footerLinkText={t('auth.haveAccount')}
        footerLinkActionText={t('auth.login')}
        onFooterLinkClick={() => navigate(AppRoute.Login)}
        
        fieldCount={3}
        >
        <form className="space-y-6" onSubmit={actions.submit} noValidate>
            <div className="relative">
            <Input 
                {...register('email')}
                type="email" 
                placeholder={t('auth.email')} 
                error={state.errors.email?.message}
            />
            </div>
            <div className="space-y-1.5 relative">
            <Input
                {...register('password')}
                type={state.showPassword ? 'text' : 'password'}
                placeholder={t('auth.password')}
                rightIcon={state.showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}
                onRightIconClick={actions.toggleShowPassword}
                rightIconAriaLabel={state.showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                error={state.errors.password?.message}
            />
            {!state.errors.password && <p className="text-[11px] text-gray-500 pl-1">{t('auth.passwordHint')}</p>}
            </div>
            <div className="relative">
            <Input
                {...register('confirmPassword')}
                type={state.showConfirmPassword ? 'text' : 'password'}
                placeholder={t('auth.confirmPassword')}
                rightIcon={state.showConfirmPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}
                onRightIconClick={actions.toggleShowConfirmPassword}
                rightIconAriaLabel={state.showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                error={state.errors.confirmPassword?.message}
            />
            </div>
            
            <Button variant="primary" type="submit" className="w-full mt-6" size="md" disabled={state.isSubmitting}>
            {state.isSubmitting 
                ? <LoadingSpinner size="sm" className="w-5 h-5 border-black/20 border-t-black" />
                : t('auth.register')
            }
            </Button>
            <p className="text-[10px] text-center text-gray-500 leading-tight !mt-3">
            {t('auth.agree')}<br />
            с <button type="button" onClick={() => navigate(`${AppRoute.Docs}/agreement`)} className="underline hover:text-gray-300 transition-colors">{t('auth.userAgreement')}</button> и <button type="button" onClick={() => navigate(`${AppRoute.Docs}/privacy`)} className="underline hover:text-gray-300 transition-colors">{t('auth.privacyPolicy')}</button>
            </p>
        </form>
        </AuthFormWrapper>
    </>
  );
};

export default Registration;
