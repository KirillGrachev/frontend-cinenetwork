import type { IUserService, UserProfileData, UserSettings } from '../types';
import type { IUserDataProvider } from './providers/types';
import { getUserDataProvider } from './providers/providerFactory';

export class UserService implements IUserService {
    constructor(private readonly provider: IUserDataProvider = getUserDataProvider()) {}

    getUserSettings = (): Promise<UserSettings> => {
        return this.provider.getUserSettings();
    };

    /** `id` defaults to the authenticated user ("me"). */
    getUserProfile = (id?: string | number): Promise<UserProfileData> => {
        return this.provider.getUserProfile(id);
    };
}
