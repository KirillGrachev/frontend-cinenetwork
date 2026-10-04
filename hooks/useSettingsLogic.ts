import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from '../context/LocaleContext';
import { useToast } from '../context/ToastContext';
import { SettingsTab, ToastType } from '../types';
import type { ProfileFormValues } from '../utils/validationSchemas';
import { createProfileSchema } from '../utils/validationSchemas';
import { useUserStore } from '../store/userStore';

export const useSettingsLogic = () => {
    const { t, locale, setLocale, availableLocales } = useLocale();
    const { showToast } = useToast();

    // Use Global Store
    const user = useUserStore((state) => state.user);
    const updateUser = useUserStore((state) => state.updateUser);

    const [activeTab, setActiveTab] = useState<SettingsTab>(SettingsTab.Profile);

    // 1. Setup Form
    const schema = createProfileSchema(t);
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            username: '',
            email: '',
            bio: '',
        },
    });

    // 2. Sync Store Data to Form (One-way binding on mount/change)
    useEffect(() => {
        if (user) {
            reset({
                username: user.username,
                email: user.email,
                // Check if user object has bio (it might be UserSettings or UserProfileData)
                bio: 'bio' in user ? user.bio : '',
            });
        }
    }, [user, reset]);

    // 3. Save Handler (Optimistic Update)
    const saveChanges = handleSubmit(async (data) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Update Store immediately (Optimistic)
        updateUser({
            username: data.username,
            email: data.email,
            bio: data.bio,
        });

        showToast(t('common.toasts.success'), ToastType.Success);
    });

    return {
        state: {
            activeTab,
            formData: user || {},
            isSaving: isSubmitting,
            locale,
            availableLocales,
            t,
            errors,
        },
        actions: {
            setActiveTab,
            saveChanges,
            setLocale,
        },
        register,
        control,
    };
};
