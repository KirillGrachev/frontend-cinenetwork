import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiError, httpGetJson, httpPostJson, withQuery } from './httpClient';
import { setAuthToken, clearAuthToken } from './authToken';

const mockFetch = (implementation: Partial<Response> | (() => Promise<Response>)) => {
    const fn =
        typeof implementation === 'function'
            ? implementation
            : vi.fn().mockResolvedValue({
                  ok: true,
                  status: 200,
                  json: async () => ({}),
                  text: async () => '{}',
                  ...implementation,
              });
    vi.stubGlobal('fetch', fn);
    return fn as unknown as ReturnType<typeof vi.fn>;
};

describe('httpClient', () => {
    beforeEach(() => {
        clearAuthToken();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.useRealTimers();
        clearAuthToken();
    });

    it('parses a successful JSON response', async () => {
        mockFetch({
            ok: true,
            status: 200,
            json: async () => ({ id: 1 }),
            text: async () => '{"id":1}',
        });
        await expect(httpGetJson<{ id: number }>('/api/test')).resolves.toEqual({ id: 1 });
    });

    it('throws ApiError with the HTTP status on non-2xx', async () => {
        mockFetch({ ok: false, status: 503 } as Partial<Response>);
        const promise = httpGetJson('/api/test');
        await expect(promise).rejects.toBeInstanceOf(ApiError);
        await promise.catch((error: ApiError) => expect(error.status).toBe(503));
    });

    it('normalises network failures into ApiError(network)', async () => {
        mockFetch(() => Promise.reject(new TypeError('Failed to fetch')));
        await expect(httpGetJson('/api/x')).rejects.toMatchObject({
            name: 'ApiError',
            status: 'network',
        });
    });

    it('times out a hung request', async () => {
        vi.useFakeTimers();
        // Abort-aware stub: hangs until the client aborts, then rejects the
        // same way the platform fetch does.
        const fetchMock = vi.fn(
            (_url: string, init?: RequestInit) =>
                new Promise<Response>((_resolve, reject) => {
                    init?.signal?.addEventListener('abort', () => {
                        reject(new DOMException('The operation was aborted.', 'AbortError'));
                    });
                }),
        );
        vi.stubGlobal('fetch', fetchMock);

        const promise = httpGetJson('/api/slow', { timeoutMs: 50 });
        // Attach the rejection handler BEFORE advancing timers, otherwise the
        // rejection lands unhandled between creation and assertion.
        const assertion = expect(promise).rejects.toMatchObject({
            name: 'ApiError',
            status: 'timeout',
        });
        await vi.advanceTimersByTimeAsync(60);
        await assertion;
    });

    it('attaches the Authorization header when a session token exists', async () => {
        const fetchMock = mockFetch({ ok: true, status: 200, json: async () => ({}) });
        setAuthToken('secret-token');

        await httpGetJson('/api/me');

        const init = fetchMock.mock.calls[0][1] as RequestInit;
        expect((init.headers as Record<string, string>).Authorization).toBe('Bearer secret-token');
    });

    it('does not attach Authorization without a token', async () => {
        const fetchMock = mockFetch({ ok: true, status: 200, json: async () => ({}) });
        await httpGetJson('/api/public');
        const init = fetchMock.mock.calls[0][1] as RequestInit;
        expect((init.headers as Record<string, string>).Authorization).toBeUndefined();
    });

    it('POSTs a JSON body with the content-type header', async () => {
        const fetchMock = mockFetch({ ok: true, status: 200, json: async () => ({ ok: true }) });
        await httpPostJson('/api/auth/login', { email: 'a@b.c', password: 'x' });

        const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
        expect(url).toContain('/api/auth/login');
        expect(init.method).toBe('POST');
        expect(init.body).toBe(JSON.stringify({ email: 'a@b.c', password: 'x' }));
        expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    });

    it('treats 204 No Content as undefined', async () => {
        mockFetch({ ok: true, status: 204, text: async () => '' });
        await expect(httpPostJson<void>('/api/logout')).resolves.toBeUndefined();
    });
});

describe('withQuery', () => {
    it('skips empty and undefined values', () => {
        expect(withQuery('/api/search', { q: 'naruto', genre: undefined, year: '' })).toBe(
            '/api/search?q=naruto',
        );
    });

    it('returns the bare path without params', () => {
        expect(withQuery('/api/list', {})).toBe('/api/list');
    });

    it('encodes values', () => {
        expect(withQuery('/s', { q: 'a b&c' })).toBe('/s?q=a+b%26c');
    });
});
