import { 
    IAnimeDataProvider, 
    INewsDataProvider, 
    ICollectionDataProvider, 
    IUserDataProvider, 
    IAdminDataProvider,
    IStatusDataProvider
} from './types';
import { 
    MockAnimeProvider, 
    MockNewsProvider, 
    MockCollectionProvider, 
    MockUserProvider, 
    MockAdminProvider, 
    MockStatusProvider 
} from './mockProvider';
import { 
    ApiAnimeProvider, 
    ApiNewsProvider, 
    ApiCollectionProvider, 
    ApiUserProvider, 
    ApiAdminProvider, 
    ApiStatusProvider 
} from './apiProvider';

const USE_API_PROVIDER = typeof process !== 'undefined' && process.env.VITE_USE_MOCK_DATA === 'false';

export const getAnimeDataProvider = (): IAnimeDataProvider => 
    USE_API_PROVIDER ? new ApiAnimeProvider() : new MockAnimeProvider();

export const getNewsDataProvider = (): INewsDataProvider => 
    USE_API_PROVIDER ? new ApiNewsProvider() : new MockNewsProvider();

export const getCollectionDataProvider = (): ICollectionDataProvider => 
    USE_API_PROVIDER ? new ApiCollectionProvider() : new MockCollectionProvider();

export const getUserDataProvider = (): IUserDataProvider => 
    USE_API_PROVIDER ? new ApiUserProvider() : new MockUserProvider();

export const getAdminDataProvider = (): IAdminDataProvider => 
    USE_API_PROVIDER ? new ApiAdminProvider() : new MockAdminProvider();

export const getStatusDataProvider = (): IStatusDataProvider => 
    USE_API_PROVIDER ? new ApiStatusProvider() : new MockStatusProvider();
