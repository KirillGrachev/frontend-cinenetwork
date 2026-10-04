import React, { createContext, useContext, useCallback, useMemo } from 'react';
import type { AuthContextType, AuthCredentials } from '../types';
import { useUserStore } from '../store/userStore';
import { AuthService } from '../services/AuthService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authService = new AuthService();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const user = useUserStore((state) => state.user);
    const isAuthenticated = useUserStore((state) => state.isAuthenticated);
    const loginAction = useUserStore((state) => state.login);
    const logoutAction = useUserStore((state) => state.logout);

    // Session integrity (flag-without-token ⇒ logout) is enforced inside
    // userStore's onRehydrateStorage — synchronously, before first render.

    const login = useCallback(
        async (credentials?: AuthCredentials) => {
            const session = await authService.login(credentials ?? { email: '', password: '' });
            loginAction(session.user);
        },
        [loginAction],
    );

    const logout = useCallback(() => {
        void authService.logout();
        logoutAction();
        sessionStorage.removeItem('last_route');
    }, [logoutAction]);

    const value = useMemo<AuthContextType>(
        () => ({ isAuthenticated, user, login, logout }),
        [isAuthenticated, user, login, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
