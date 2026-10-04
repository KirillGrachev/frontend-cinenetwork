import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from '../context/LocaleContext';
import { useToast } from '../context/ToastContext';
import { ToastType, AppRoute } from '../types';
import type {
    LoginFormValues,
    RegistrationFormValues,
    RecoveryEmailFormValues,
    CodeFormValues,
    ResetPasswordFormValues,
} from '../utils/validationSchemas';
import {
    createLoginSchema,
    createRegistrationSchema,
    createRecoveryEmailSchema,
    createCodeSchema,
    createResetPasswordSchema,
} from '../utils/validationSchemas';

export const useLoginLogic = (onLoginSuccess: (credentials: LoginFormValues) => void) => {
    const { t } = useLocale();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 400);
        return () => clearTimeout(timer);
    }, []);

    const schema = createLoginSchema(t);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (data: LoginFormValues) => {
        // TODO(api): POST data.email / data.password to the auth endpoint.
        // Simulated latency until the backend exists.
        await new Promise((resolve) => setTimeout(resolve, 500));
        onLoginSuccess(data);
    };

    const actions = {
        toggleShowPassword: () => setShowPassword((prev) => !prev),
        submit: handleSubmit(onSubmit), // RHF wrapper
    };

    return {
        state: {
            showPassword,
            errors,
            isSubmitting,
            isLoading,
        },
        register, // Expose register
        actions,
    };
};

export const useRegistrationLogic = () => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 400);
        return () => clearTimeout(timer);
    }, []);

    const schema = createRegistrationSchema(t);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegistrationFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: '', password: '', confirmPassword: '' },
    });

    const onSubmit = async (data: RegistrationFormValues) => {
        // Simulate API
        await new Promise((resolve) => setTimeout(resolve, 500));
        showToast(t('auth.formSuccess.registerSuccess'), ToastType.Success);
        // Redirect to verify page with email in state
        navigate(AppRoute.VerifyEmail, { state: { email: data.email } });
    };

    const actions = {
        toggleShowPassword: () => setShowPassword((prev) => !prev),
        toggleShowConfirmPassword: () => setShowConfirmPassword((prev) => !prev),
        submit: handleSubmit(onSubmit),
    };

    return {
        state: { showPassword, showConfirmPassword, errors, isSubmitting, isLoading },
        register,
        actions,
    };
};

// --- Password Recovery Hook ---
export const usePasswordRecovery = () => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState('');
    const [timer, setTimer] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Schemas
    const emailSchema = createRecoveryEmailSchema(t);
    const codeSchema = createCodeSchema(t);
    const resetSchema = createResetPasswordSchema(t);

    // Forms
    const emailForm = useForm<RecoveryEmailFormValues>({ resolver: zodResolver(emailSchema) });
    const codeForm = useForm<CodeFormValues>({ resolver: zodResolver(codeSchema) });
    const resetForm = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetSchema) });

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Handlers
    const onEmailSubmit = async (data: RecoveryEmailFormValues) => {
        await new Promise((r) => setTimeout(r, 500));
        setEmail(data.email);
        setStep(2);
        setTimer(60);
        showToast(t('auth.formSuccess.registerSuccess'), ToastType.Success);
    };

    const onCodeSubmit = async (data: CodeFormValues) => {
        await new Promise((r) => setTimeout(r, 500));
        if (data.code !== '123456') {
            // Mock check for 6 digits
            codeForm.setError('code', { message: t('auth.formErrors.invalidCode') });
            return;
        }
        setStep(3);
    };

    const onResetSubmit = async () => {
        // TODO(api): submit the new password together with the verified code.
        await new Promise((r) => setTimeout(r, 500));
        showToast(t('auth.formSuccess.resetSuccess'), ToastType.Success);
        navigate(AppRoute.Login);
    };

    const resendCode = () => {
        setTimer(60);
        showToast(t('auth.formSuccess.registerSuccess'), ToastType.Info);
    };

    return {
        state: {
            step,
            email,
            timer,
            showPassword,
            showConfirmPassword,
            emailForm: {
                register: emailForm.register,
                errors: emailForm.formState.errors,
                isSubmitting: emailForm.formState.isSubmitting,
            },
            codeForm: {
                register: codeForm.register,
                errors: codeForm.formState.errors,
                isSubmitting: codeForm.formState.isSubmitting,
            },
            resetForm: {
                register: resetForm.register,
                errors: resetForm.formState.errors,
                isSubmitting: resetForm.formState.isSubmitting,
            },
        },
        actions: {
            submitEmail: emailForm.handleSubmit(onEmailSubmit),
            submitCode: codeForm.handleSubmit(onCodeSubmit),
            submitReset: resetForm.handleSubmit(onResetSubmit),
            resendCode,
            toggleShowPassword: () => setShowPassword((p) => !p),
            toggleShowConfirmPassword: () => setShowConfirmPassword((p) => !p),
        },
    };
};

// --- Verify Email Hook ---
export const useVerifyEmail = (onVerifySuccess?: () => void) => {
    const { t } = useLocale();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [timer, setTimer] = useState(60);

    const schema = createCodeSchema(t);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CodeFormValues>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const onSubmit = async (data: CodeFormValues) => {
        await new Promise((r) => setTimeout(r, 800));
        if (data.code !== '123456') {
            // Mock check for 6 digits
            setError('code', { message: t('auth.formErrors.invalidCode') });
            return;
        }
        showToast(t('auth.formSuccess.verifySuccess'), ToastType.Success);
        if (onVerifySuccess) {
            onVerifySuccess();
        } else {
            navigate(AppRoute.Login);
        }
    };

    const resendCode = () => {
        setTimer(60);
        showToast(t('auth.formSuccess.registerSuccess'), ToastType.Info);
    };

    return {
        state: { timer, errors, isSubmitting },
        register,
        actions: {
            submit: handleSubmit(onSubmit),
            resendCode,
        },
    };
};
