import React from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocaleProvider } from '../context/LocaleContext';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import { loadLocaleDictionary } from '../locales/registry';

/**
 * Renders a component inside the full provider stack used by the app.
 *
 * Dictionaries are pre-loaded into the registry cache so the LocaleProvider
 * gate resolves in a microtask instead of a real chunk fetch.
 */

let dictionariesPreloaded = false;

export async function preloadDictionaries(): Promise<void> {
    if (dictionariesPreloaded) return;
    await Promise.all([loadLocaleDictionary('ru'), loadLocaleDictionary('en')]);
    dictionariesPreloaded = true;
}

interface AppRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    route?: string;
}

export async function renderWithProviders(ui: React.ReactElement, options: AppRenderOptions = {}) {
    const { route = '/', ...rest } = options;
    await preloadDictionaries();

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0, staleTime: 0 },
        },
    });

    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={[route]}>
                <LocaleProvider>
                    <ToastProvider>
                        <AuthProvider>{children}</AuthProvider>
                    </ToastProvider>
                </LocaleProvider>
            </MemoryRouter>
        </QueryClientProvider>
    );

    return { ...render(ui, { wrapper: Wrapper, ...rest }), queryClient };
}
