
import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { AuthContextType, UserSettings } from '../types';
import { useUserStore } from '../store/userStore';
import { userService } from '../services/apiService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Connect to Zustand Store
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const loginAction = useUserStore((state) => state.login);
  const logoutAction = useUserStore((state) => state.logout);

  const login = useCallback(async () => {
    // 1. Simulate API Login call
    const mockUser = await userService.getUserSettings();
    
    // 2. Update Store (which persists to LocalStorage automatically)
    loginAction(mockUser);
  }, [loginAction]);

  const logout = useCallback(() => {
    logoutAction();
    sessionStorage.removeItem('last_route');
  }, [logoutAction]);

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    login,
    logout,
  }), [isAuthenticated, user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
