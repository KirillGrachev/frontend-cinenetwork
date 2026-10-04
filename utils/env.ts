import { z } from 'zod';

/**
 * Runtime validation of the Vite environment.
 *
 * `.env.example` documents the supported variables; this module makes them
 * a *contract*: a typo'd/invalid `.env` fails fast at boot with a readable
 * message instead of silently misbehaving at request time.
 */
const envSchema = z.object({
    /** 'true' switches data providers from mocks to the real REST API. */
    VITE_API_ENABLED: z.enum(['true', 'false']).optional(),
    /** Backend origin, e.g. https://api.cinenetwork.example (no trailing slash needed). */
    VITE_API_BASE_URL: z.union([z.literal(''), z.string().url()]).optional(),
});

/** `VAR=` in .env yields an empty string — treat it as "not set", not as an error. */
const orUndefined = (value: string | undefined): string | undefined =>
    value === '' ? undefined : value;

const parsed = envSchema.safeParse({
    VITE_API_ENABLED: orUndefined(import.meta.env.VITE_API_ENABLED),
    VITE_API_BASE_URL: orUndefined(import.meta.env.VITE_API_BASE_URL),
});

if (!parsed.success) {
    const issues = parsed.error.issues
        .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
        .join('; ');
    throw new Error(
        `Invalid environment configuration (see .env.example for the supported values): ${issues}`,
    );
}

export const appEnv = {
    /** Real REST API instead of mock providers. */
    apiEnabled: parsed.data.VITE_API_ENABLED === 'true',
    /** Normalised backend origin (trailing slash stripped). */
    apiBaseUrl: (parsed.data.VITE_API_BASE_URL ?? '').replace(/\/+$/, ''),
    isDev: import.meta.env.DEV,
} as const;
