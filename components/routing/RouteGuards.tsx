import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import { AppRoute } from '../../types';

/**
 * Route guards.
 *
 * Previously every route — including `/admin/*` — rendered for anonymous
 * visitors. These are declarative wrappers so protection lives in the route
 * table (auditable in one place) instead of scattered component checks.
 *
 * NOTE: client-side guards are a UX measure, not a security boundary. The
 * server must authorise every request independently.
 */

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={AppRoute.Login} state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

interface RequireRoleProps {
    roles: UserRole[];
    children: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ roles, children }) => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={AppRoute.Login} state={{ from: location }} replace />;
    }

    if (!user?.role || !roles.includes(user.role)) {
        return <Navigate to={AppRoute.Home} replace />;
    }

    return <>{children}</>;
};
