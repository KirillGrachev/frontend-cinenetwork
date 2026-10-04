import { describe, it, expect, afterEach } from 'vitest';

/**
 * utils/env parses import.meta.env at module load, so each scenario resets
 * the module registry and re-imports it with stubbed variables.
 */
async function loadEnv(vars: Record<string, string>) {
    for (const [key, value] of Object.entries(vars)) {
        vi.stubEnv(key, value);
    }
    vi.resetModules();
    const mod = await import('./env');
    return mod.appEnv;
}

import { vi } from 'vitest';

describe('appEnv', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.resetModules();
    });

    it('defaults to mock mode with an empty base url', async () => {
        const env = await loadEnv({});
        expect(env.apiEnabled).toBe(false);
        expect(env.apiBaseUrl).toBe('');
    });

    it('enables the API layer only on the literal string "true"', async () => {
        expect((await loadEnv({ VITE_API_ENABLED: 'true' })).apiEnabled).toBe(true);
        expect((await loadEnv({ VITE_API_ENABLED: 'false' })).apiEnabled).toBe(false);
        // '1' is not a supported literal — fail fast instead of guessing.
        vi.stubEnv('VITE_API_ENABLED', '1');
        vi.resetModules();
        await expect(import('./env')).rejects.toThrow(/environment/i);
    });

    it('strips trailing slashes from the base url', async () => {
        const env = await loadEnv({ VITE_API_BASE_URL: 'https://api.example.com///' });
        expect(env.apiBaseUrl).toBe('https://api.example.com');
    });

    it('throws a readable error on an invalid base url', async () => {
        vi.stubEnv('VITE_API_BASE_URL', 'not-a-url');
        vi.resetModules();
        await expect(import('./env')).rejects.toThrow(/VITE_API_BASE_URL|environment/i);
    });

    it('throws on an unsupported VITE_API_ENABLED value', async () => {
        vi.stubEnv('VITE_API_ENABLED', 'yes-please');
        vi.resetModules();
        await expect(import('./env')).rejects.toThrow(/environment/i);
    });
});
