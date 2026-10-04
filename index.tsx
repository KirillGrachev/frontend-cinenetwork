import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Self-hosted assets (no third-party CDN at runtime — removes an SPOF and
// makes a strict CSP possible).
import '@fontsource-variable/inter';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles.css';
import App from './App';
import { LocaleProvider } from './context/LocaleContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

/**
 * Browsers emit a benign "ResizeObserver loop completed with undelivered
 * notifications" error that no app code can act upon. Suppress exactly that
 * and nothing else — the previous version triple-patched window.onerror,
 * addEventListener('error') and 'unhandledrejection', which risked hiding
 * real failures.
 */
window.addEventListener(
    'error',
    (event) => {
        const message = event.message ?? event.error?.message;
        if (typeof message === 'string' && message.includes('ResizeObserver loop')) {
            event.stopImmediatePropagation();
        }
    },
    true,
);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // The previous client used React Query defaults (staleTime: 0),
            // causing a refetch storm on every mount/window focus.
            staleTime: 60_000,
            gcTime: 10 * 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

/** Devtools must never ship in the production bundle. */
const ReactQueryDevtools = import.meta.env.DEV
    ? lazy(() =>
          import('@tanstack/react-query-devtools').then((m) => ({
              default: m.ReactQueryDevtools,
          })),
      )
    : null;

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element #root not found — check index.html');
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            {/**
             * BrowserRouter (clean URLs) instead of the former HashRouter:
             * '#/...' fragments are effectively invisible to search engines,
             * which contradicts the SEO effort (schema.org, OG tags).
             * Deployment must serve index.html as the SPA fallback for all
             * paths (see README "Deployment").
             */}
            <BrowserRouter>
                <LocaleProvider>
                    <ToastProvider>
                        <AuthProvider>
                            <App />
                        </AuthProvider>
                    </ToastProvider>
                </LocaleProvider>
            </BrowserRouter>
            {ReactQueryDevtools && (
                <Suspense fallback={null}>
                    <ReactQueryDevtools initialIsOpen={false} />
                </Suspense>
            )}
        </QueryClientProvider>
    </React.StrictMode>,
);
