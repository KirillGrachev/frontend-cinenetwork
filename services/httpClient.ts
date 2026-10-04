/**
 * Minimal typed HTTP client used by the API providers.
 *
 * Responsibilities:
 *  - resolve paths against VITE_API_BASE_URL;
 *  - enforce a request timeout (a hung request must not pin a UI in
 *    "loading" forever);
 *  - normalise failures into a single `ApiError` type so callers (and
 *    React Query) can distinguish transport/HTTP errors from bugs.
 *
 * Deliberately NOT done here: silent fallbacks to mock data. Hiding a
 * failing backend behind fake data makes outages invisible; error handling
 * and retries belong to React Query, UI states belong to components.
 */

import { getAuthToken } from './authToken';
import { appEnv } from '../utils/env';

export class ApiError extends Error {
    constructor(
        readonly status: number | 'timeout' | 'network',
        message: string,
        readonly cause?: unknown,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

const DEFAULT_TIMEOUT_MS = 10_000;

const baseUrl = appEnv.apiBaseUrl;

export interface HttpGetOptions {
    timeoutMs?: number;
    signal?: AbortSignal;
}

interface RequestOptions extends HttpGetOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
}

async function requestJson<T>(path: string, options: RequestOptions): Promise<T> {
    const { timeoutMs = DEFAULT_TIMEOUT_MS, signal, method = 'GET', body } = options;
    const url = `${baseUrl}${path}`;

    const controller = new AbortController();
    const onOuterAbort = () => controller.abort();
    signal?.addEventListener('abort', onOuterAbort);
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const headers: Record<string, string> = { Accept: 'application/json' };
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    try {
        const response = await fetch(url, {
            method,
            signal: controller.signal,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            throw new ApiError(
                response.status,
                `${method} ${path} failed: HTTP ${response.status}`,
            );
        }

        // 204 No Content and empty bodies are valid for e.g. DELETE/POST logout.
        if (response.status === 204) return undefined as T;
        const text = await response.text();
        return (text ? JSON.parse(text) : undefined) as T;
    } catch (error) {
        if (error instanceof ApiError) throw error;

        // Abort surfaces as DOMException in browsers, Error in some test
        // environments — match on the name, not the class.
        if (error instanceof Error && error.name === 'AbortError') {
            // Distinguish caller-initiated cancel from our timeout.
            if (signal?.aborted) throw error;
            throw new ApiError(
                'timeout',
                `${method} ${path} timed out after ${timeoutMs}ms`,
                error,
            );
        }

        throw new ApiError('network', `${method} ${path} failed: network error`, error);
    } finally {
        clearTimeout(timer);
        signal?.removeEventListener('abort', onOuterAbort);
    }
}

export function httpGetJson<T>(path: string, options: HttpGetOptions = {}): Promise<T> {
    return requestJson<T>(path, { ...options, method: 'GET' });
}

export function httpPostJson<T>(
    path: string,
    body?: unknown,
    options: HttpGetOptions = {},
): Promise<T> {
    return requestJson<T>(path, { ...options, method: 'POST', body });
}

/** Builds `/path?a=1&b=2`, skipping empty values. */
export function withQuery(
    path: string,
    params: Record<string, string | number | undefined>,
): string {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== '') search.append(key, String(value));
    }
    const qs = search.toString();
    return qs ? `${path}?${qs}` : path;
}
