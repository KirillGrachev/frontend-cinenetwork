/**
 * Auth token storage.
 *
 * DEMO-GRADE PERSISTENCE: the token lives in localStorage so a reload keeps
 * the session. With a real backend this must be replaced by an httpOnly
 * cookie (localStorage tokens are readable by any XSS payload). The rest of
 * the app only talks to this module, so the swap is a one-file change.
 */

const TOKEN_KEY = 'cine-network-auth-token';

let memoryToken: string | null = null;

export function getAuthToken(): string | null {
    if (memoryToken !== null) return memoryToken;
    try {
        memoryToken = localStorage.getItem(TOKEN_KEY);
    } catch {
        memoryToken = null;
    }
    return memoryToken;
}

export function setAuthToken(token: string | null): void {
    memoryToken = token;
    try {
        if (token === null) {
            localStorage.removeItem(TOKEN_KEY);
        } else {
            localStorage.setItem(TOKEN_KEY, token);
        }
    } catch {
        // Storage unavailable (private mode) — memory-only session.
    }
}

export function clearAuthToken(): void {
    setAuthToken(null);
}
