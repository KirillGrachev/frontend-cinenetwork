import type {
    IAdminDataProvider,
    IAuthDataProvider,
    IAnimeDataProvider,
    ICollectionDataProvider,
    INewsDataProvider,
    INotificationDataProvider,
    IStatusDataProvider,
    IUserDataProvider,
} from './types';
import {
    MockAdminProvider,
    MockAuthProvider,
    MockAnimeProvider,
    MockCollectionProvider,
    MockNewsProvider,
    MockNotificationProvider,
    MockStatusProvider,
    MockUserProvider,
} from './mockProvider';
import { appEnv } from '../../utils/env';
import {
    ApiAdminProvider,
    ApiAuthProvider,
    ApiAnimeProvider,
    ApiCollectionProvider,
    ApiNewsProvider,
    ApiNotificationProvider,
    ApiStatusProvider,
    ApiUserProvider,
} from './apiProvider';

/**
 * Provider selection.
 *
 * Mock providers are the default so the demo runs anywhere. The real REST
 * providers are enabled exclusively via Vite env — note this must be
 * `import.meta.env` (build-time inlined); the previous `process.env` check
 * could never be true in a browser, making the API mode dead code.
 */
const USE_API_PROVIDERS = appEnv.apiEnabled;

/**
 * Providers are stateless, so one lazily-created singleton per contract is
 * enough; previously every getter call constructed a fresh instance.
 */
function singleton<T>(factory: () => T): () => T {
    let instance: T | undefined;
    return () => (instance ??= factory());
}

export const getAnimeDataProvider = singleton<IAnimeDataProvider>(() =>
    USE_API_PROVIDERS ? new ApiAnimeProvider() : new MockAnimeProvider(),
);

export const getNewsDataProvider = singleton<INewsDataProvider>(() =>
    USE_API_PROVIDERS ? new ApiNewsProvider() : new MockNewsProvider(),
);

export const getCollectionDataProvider = singleton<ICollectionDataProvider>(() =>
    USE_API_PROVIDERS ? new ApiCollectionProvider() : new MockCollectionProvider(),
);

export const getUserDataProvider = singleton<IUserDataProvider>(() =>
    USE_API_PROVIDERS ? new ApiUserProvider() : new MockUserProvider(),
);

export const getNotificationDataProvider = singleton<INotificationDataProvider>(() =>
    USE_API_PROVIDERS ? new ApiNotificationProvider() : new MockNotificationProvider(),
);

export const getAdminDataProvider = singleton<IAdminDataProvider>(() =>
    USE_API_PROVIDERS ? new ApiAdminProvider() : new MockAdminProvider(),
);

export const getStatusDataProvider = singleton<IStatusDataProvider>(() =>
    USE_API_PROVIDERS ? new ApiStatusProvider() : new MockStatusProvider(),
);

export const getAuthDataProvider = singleton<IAuthDataProvider>(() =>
    USE_API_PROVIDERS ? new ApiAuthProvider() : new MockAuthProvider(),
);
