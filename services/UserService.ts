import { BaseService } from './BaseService';
import { IUserService, UserSettings, HistoryItem, UserProfileData } from '../types';
import { IUserDataProvider } from './providers/types';
import { getUserDataProvider } from './providers/providerFactory';

export class UserService extends BaseService implements IUserService {
  constructor(private provider: IUserDataProvider = getUserDataProvider()) {
    super();
  }

  getUserSettings = (): Promise<UserSettings> => {
    return this.cachedRequest('userSettings', () => this.provider.getUserSettings());
  }

  getUserProfile = (id?: string | number): Promise<UserProfileData> => {
    return this.cachedRequest(`userProfile_${id || 'me'}`, () => this.provider.getUserProfile(id));
  }

  getHistory = (): Promise<HistoryItem[]> => {
    throw new Error("Use useAnimeStore.getState().history instead for persistent client-side history.");
  }
}
