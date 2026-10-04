import type { AuthCredentials, AuthSession, UserProfileData } from '../types';
import type { IAuthDataProvider } from './providers/types';
import { getAuthDataProvider } from './providers/providerFactory';
import { clearAuthToken, setAuthToken } from './authToken';

/**
 * Authentication orchestration: provider call + session-token persistence.
 * Components never touch tokens directly — only AuthContext talks to this.
 */
export class AuthService {
    constructor(private readonly provider: IAuthDataProvider = getAuthDataProvider()) {}

    login = async (credentials: AuthCredentials): Promise<AuthSession> => {
        const session = await this.provider.login(credentials);
        setAuthToken(session.token);
        return session;
    };

    logout = async (): Promise<void> => {
        try {
            await this.provider.logout();
        } catch {
            // A failing remote logout must not lock the user out locally.
        } finally {
            clearAuthToken();
        }
    };

    getCurrentUser = (): Promise<UserProfileData> => this.provider.getCurrentUser();
}
