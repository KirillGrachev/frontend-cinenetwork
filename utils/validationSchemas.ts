import { z } from 'zod';
import type { TFunction } from './i18n';
import { AttachmentType, UserRole, BanDuration } from '../types';

// --- Auth Schemas ---

export const createLoginSchema = (t: TFunction) =>
    z.object({
        email: z
            .string()
            .min(1, t('auth.formErrors.required'))
            .email(t('auth.formErrors.invalidEmail')),
        password: z.string().min(1, t('auth.formErrors.required')),
    });

export const createRegistrationSchema = (t: TFunction) =>
    z
        .object({
            email: z
                .string()
                .min(1, t('auth.formErrors.required'))
                .email(t('auth.formErrors.invalidEmail')),
            password: z.string().min(8, t('auth.formErrors.passwordTooShort')),
            confirmPassword: z.string().min(1, t('auth.formErrors.required')),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t('auth.formErrors.passwordsDoNotMatch'),
            path: ['confirmPassword'],
        });

// Forgot Password - Step 1
export const createRecoveryEmailSchema = (t: TFunction) =>
    z.object({
        email: z
            .string()
            .min(1, t('auth.formErrors.required'))
            .email(t('auth.formErrors.invalidEmail')),
    });

// Forgot Password - Step 2 (Code) & Verify Email
export const createCodeSchema = (t: TFunction) =>
    z.object({
        code: z.string().length(6, t('auth.formErrors.invalidCode')),
    });

// Forgot Password - Step 3 (New Password)
export const createResetPasswordSchema = (t: TFunction) =>
    z
        .object({
            password: z.string().min(8, t('auth.formErrors.passwordTooShort')),
            confirmPassword: z.string().min(1, t('auth.formErrors.required')),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t('auth.formErrors.passwordsDoNotMatch'),
            path: ['confirmPassword'],
        });

// --- User & Profile Schemas ---

export const createProfileSchema = (t: TFunction) =>
    z.object({
        username: z.string().min(3, t('auth.formErrors.required')),
        email: z.string().email(t('auth.formErrors.invalidEmail')),
        bio: z.string().optional(),
    });

export const createCuratorSchema = (t: TFunction) =>
    z.object({
        name: z.string().min(2, t('support.formErrors.required')),
        email: z.string().email(t('auth.formErrors.invalidEmail')),
        motivation: z.string().min(10, t('support.formErrors.required')),
    });

// --- Support & Report Schemas ---

export const createSupportSchema = (t: TFunction) =>
    z
        .object({
            name: z.string().min(2, t('support.formErrors.required')),
            email: z
                .string()
                .min(1, t('support.formErrors.required'))
                .email(t('auth.formErrors.invalidEmail')),
            topic: z.string(),
            subject: z.string().min(5, t('support.formErrors.required')),
            message: z.string().min(10, t('support.formErrors.required')),
            attachmentType: z.nativeEnum(AttachmentType).optional(),
            link: z.string().optional(),
        })
        .superRefine((data, ctx) => {
            // If "Link" type is selected, the link field becomes mandatory and must be a valid URL
            if (data.attachmentType === AttachmentType.Link) {
                if (!data.link || data.link.trim().length === 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: t('support.formErrors.required'),
                        path: ['link'],
                    });
                } else if (!data.link.startsWith('http')) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: t('support.formErrors.invalidLink'),
                        path: ['link'],
                    });
                }
            }
        });

export const createReportSchema = (t: TFunction) =>
    z
        .object({
            reason: z.string(),
            description: z.string().optional(),
        })
        .superRefine((data, ctx) => {
            // Description is required if reason is 'other'
            if (
                data.reason === 'other' &&
                (!data.description || data.description.trim().length === 0)
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('support.formErrors.required'),
                    path: ['description'],
                });
            }
        });

// --- Content Interaction Schemas ---

export const createReviewSchema = (t: TFunction) =>
    z.object({
        rating: z.number().min(1, t('media.anime.reviews.ratingRequired')),
        content: z.string().min(3, t('media.anime.reviews.textRequired')),
        isSpoiler: z.boolean().optional(),
    });

export const createCommentSchema = (t: TFunction) =>
    z.object({
        content: z.string().min(1, t('media.anime.reviews.textRequired')),
    });

// --- Admin Schemas ---

export const createTicketReplySchema = (t: TFunction) =>
    z.object({
        content: z.string().min(1, t('support.formErrors.required')),
    });

export const createAdminUserEditSchema = () =>
    z.object({
        role: z.nativeEnum(UserRole),
    });

export const createAdminUserBanSchema = (t: TFunction) =>
    z.object({
        banDuration: z.nativeEnum(BanDuration),
        banReason: z.string().min(1, t('support.formErrors.required')),
    });

export const createModerationRejectSchema = (t: TFunction) =>
    z.object({
        reason: z.string().min(1, t('support.formErrors.required')),
        duration: z.nativeEnum(BanDuration).optional(),
    });

// --- Type Exports ---

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegistrationFormValues = z.infer<ReturnType<typeof createRegistrationSchema>>;
export type RecoveryEmailFormValues = z.infer<ReturnType<typeof createRecoveryEmailSchema>>;
export type CodeFormValues = z.infer<ReturnType<typeof createCodeSchema>>;
export type ResetPasswordFormValues = z.infer<ReturnType<typeof createResetPasswordSchema>>;
export type SupportFormValues = z.infer<ReturnType<typeof createSupportSchema>>;
export type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>;
export type CuratorFormValues = z.infer<ReturnType<typeof createCuratorSchema>>;
export type ReviewFormValues = z.infer<ReturnType<typeof createReviewSchema>>;
export type ReportFormValues = z.infer<ReturnType<typeof createReportSchema>>;
export type CommentFormValues = z.infer<ReturnType<typeof createCommentSchema>>;
export type TicketReplyFormValues = z.infer<ReturnType<typeof createTicketReplySchema>>;
export type AdminUserEditValues = z.infer<ReturnType<typeof createAdminUserEditSchema>>;
export type AdminUserBanValues = z.infer<ReturnType<typeof createAdminUserBanSchema>>;
export type ModerationRejectValues = z.infer<ReturnType<typeof createModerationRejectSchema>>;
