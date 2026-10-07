
import React from 'react';
import { useNavigate } from 'react-router';
import Input from './ui/Input';
import Button from './ui/Button';
import AuthFormWrapper from './auth/AuthFormWrapper';
import { useLocale } from '../context/LocaleContext';
import { useLoginLogic } from '../hooks/useAuthForms';
import LoadingSpinner from './LoadingSpinner';
import { AppRoute } from '../types';
import SEO from './SEO';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const { state, actions, register } = useLoginLogic(onLoginSuccess);

  return (
    <>
        <SEO title={t('auth.login')} />
        <AuthFormWrapper
        title={t('auth.login')}
        footerLinkText={t('auth.noAccount')}
        footerLinkActionText={t('auth.register')}
        onFooterLinkClick={() => navigate(AppRoute.Register)}
        
        fieldCount={2}
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
            <div className="relative">
            <Input
                {...register('password')}
                type={state.showPassword ? 'text' : 'password'}
                placeholder={t('auth.password')}
                rightIcon={state.showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}
                onRightIconClick={actions.toggleShowPassword}
                rightIconAriaLabel={state.showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                error={state.errors.password?.message}
            />
            <div className="flex justify-end mt-2">
                <button 
                    type="button" 
                    onClick={() => navigate(AppRoute.ForgotPassword)}
                    className="text-[11px] text-gray-500 hover:text-white transition-colors"
                >
                    {t('auth.forgotPassword')}
                </button>
            </div>
            </div>
            
            <Button type="submit" variant="primary" className="w-full !mt-6" size="md" disabled={state.isSubmitting}>
            {state.isSubmitting 
                ? <LoadingSpinner size="sm" className="w-5 h-5 border-black/20 border-t-black" />
                : t('auth.login')
            }
            </Button>
        </form>
        </AuthFormWrapper>
    </>
  );
};

export default Login;
