import { describe, it, expect, vi, afterEach } from 'vitest';

/**
 * The factory reads `import.meta.env.VITE_API_ENABLED` at module load, so
 * each scenario resets the module registry and re-imports it.
 */
async function importFactory(apiEnabled: string | undefined) {
    if (apiEnabled === undefined) {
        vi.stubEnv('VITE_API_ENABLED', '');
    } else {
        vi.stubEnv('VITE_API_ENABLED', apiEnabled);
    }
    vi.resetModules();
    return import('./providerFactory');
}

describe('providerFactory', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.resetModules();
    });

    it('returns mock providers by default (demo runs offline)', async () => {
        const factory = await importFactory(undefined);
        const provider = factory.getAnimeDataProvider();
        expect(provider.constructor.name).toBe('MockAnimeProvider');
    });

    it('returns mock providers when the flag is explicitly false', async () => {
        const factory = await importFactory('false');
        expect(factory.getNewsDataProvider().constructor.name).toBe('MockNewsProvider');
    });

    it('returns API providers when VITE_API_ENABLED=true', async () => {
        const factory = await importFactory('true');
        expect(factory.getAnimeDataProvider().constructor.name).toBe('ApiAnimeProvider');
        expect(factory.getNewsDataProvider().constructor.name).toBe('ApiNewsProvider');
        expect(factory.getCollectionDataProvider().constructor.name).toBe('ApiCollectionProvider');
        expect(factory.getUserDataProvider().constructor.name).toBe('ApiUserProvider');
        expect(factory.getNotificationDataProvider().constructor.name).toBe(
            'ApiNotificationProvider',
        );
        expect(factory.getAdminDataProvider().constructor.name).toBe('ApiAdminProvider');
        expect(factory.getStatusDataProvider().constructor.name).toBe('ApiStatusProvider');
        expect(factory.getAuthDataProvider().constructor.name).toBe('ApiAuthProvider');
    });

    it('returns the same singleton instance across calls', async () => {
        const factory = await importFactory('true');
        expect(factory.getAnimeDataProvider()).toBe(factory.getAnimeDataProvider());
        expect(factory.getAuthDataProvider()).toBe(factory.getAuthDataProvider());
    });
});
