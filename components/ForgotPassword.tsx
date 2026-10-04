import React from 'react';
import { useNavigate } from 'react-router';
import Input from './ui/Input';
import Button from './ui/Button';
import AuthFormWrapper from './auth/AuthFormWrapper';
import { useLocale } from '../context/LocaleContext';
import { usePasswordRecovery } from '../hooks/useAuthForms';
import LoadingSpinner from './LoadingSpinner';
import { AppRoute } from '../types';
import SEO from './SEO';

const ForgotPassword: React.FC = () => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const { state, actions } = usePasswordRecovery();
    const { step, email, timer } = state;

    // Render logic for different steps
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <form
                        key="step-email"
                        onSubmit={actions.submitEmail}
                        className="space-y-6 page-reveal"
                    >
                        <p className="text-gray-400 text-sm text-center mb-4">
                            {t('auth.recovery.step1Desc')}
                        </p>
                        <Input
                            {...state.emailForm.register('email')}
                            type="email"
                            placeholder={t('auth.email')}
                            error={state.emailForm.errors.email?.message}
                            autoFocus
                        />
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-full"
                            disabled={state.emailForm.isSubmitting}
                        >
                            {state.emailForm.isSubmitting ? (
                                <LoadingSpinner
                                    size="sm"
                                    className="w-5 h-5 border-black/20 border-t-black"
                                />
                            ) : (
                                t('auth.recovery.sendCode')
                            )}
                        </Button>
                    </form>
                );
            case 2:
                return (
                    <form
                        key="step-code"
                        onSubmit={actions.submitCode}
                        className="space-y-6 page-reveal"
                    >
                        <p className="text-gray-400 text-sm text-center mb-4">
                            {t('auth.recovery.step2Desc', { email })}
                        </p>
                        <Input
                            {...state.codeForm.register('code')}
                            placeholder="000000"
                            className="text-center tracking-[1em] font-bold text-lg"
                            maxLength={6}
                            error={state.codeForm.errors.code?.message}
                            autoFocus
                        />
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-full"
                            disabled={state.codeForm.isSubmitting}
                        >
                            {state.codeForm.isSubmitting ? (
                                <LoadingSpinner
                                    size="sm"
                                    className="w-5 h-5 border-black/20 border-t-black"
                                />
                            ) : (
                                t('auth.recovery.verifyCode')
                            )}
                        </Button>

                        {/* Removed mt-4/!mt-4 to let space-y-6 handle spacing naturally */}
                        <div className="text-center">
                            {timer > 0 ? (
                                <p className="text-xs text-gray-500">
                                    {t('auth.recovery.resendIn', { seconds: timer })}
                                </p>
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
                );
            case 3:
                return (
                    <form
                        key="step-reset"
                        onSubmit={actions.submitReset}
                        className="space-y-6 page-reveal"
                    >
                        <p className="text-gray-400 text-sm text-center mb-4">
                            {t('auth.recovery.step3Desc')}
                        </p>
                        <div className="space-y-1.5 relative">
                            <Input
                                {...state.resetForm.register('password')}
                                type={state.showPassword ? 'text' : 'password'}
                                placeholder={t('auth.password')}
                                rightIcon={
                                    state.showPassword
                                        ? 'fa-regular fa-eye-slash'
                                        : 'fa-regular fa-eye'
                                }
                                onRightIconClick={actions.toggleShowPassword}
                                error={state.resetForm.errors.password?.message}
                            />
                            {!state.resetForm.errors.password && (
                                <p className="text-[11px] text-gray-500 pl-1">
                                    {t('auth.passwordHint')}
                                </p>
                            )}
                        </div>
                        <div className="relative">
                            <Input
                                {...state.resetForm.register('confirmPassword')}
                                type={state.showConfirmPassword ? 'text' : 'password'}
                                placeholder={t('auth.confirmPassword')}
                                rightIcon={
                                    state.showConfirmPassword
                                        ? 'fa-regular fa-eye-slash'
                                        : 'fa-regular fa-eye'
                                }
                                onRightIconClick={actions.toggleShowConfirmPassword}
                                error={state.resetForm.errors.confirmPassword?.message}
                            />
                        </div>
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-full"
                            disabled={state.resetForm.isSubmitting}
                        >
                            {state.resetForm.isSubmitting ? (
                                <LoadingSpinner
                                    size="sm"
                                    className="w-5 h-5 border-black/20 border-t-black"
                                />
                            ) : (
                                t('auth.recovery.resetPass')
                            )}
                        </Button>
                    </form>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <SEO title={t('auth.recovery.title')} />
            <AuthFormWrapper
                title={t('auth.recovery.title')}
                footerLinkText=""
                footerLinkActionText={t('auth.recovery.backToLogin')}
                onFooterLinkClick={() => navigate(AppRoute.Login)}
            >
                {renderStepContent()}
            </AuthFormWrapper>
        </>
    );
};

export default ForgotPassword;
