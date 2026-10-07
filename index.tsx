import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import './styles.css';
import App from './App';
import { LocaleProvider } from './context/LocaleContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Handle benign ResizeObserver loop warning from browser
const isResizeObserverError = (msg: unknown) => 
  typeof msg === 'string' && (msg.includes('ResizeObserver loop') || msg.includes('undelivered notifications'));

window.addEventListener('error', (e) => {
  if (isResizeObserverError(e.message) || isResizeObserverError(e.error?.message)) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
  }
}, true);

window.addEventListener('unhandledrejection', (e) => {
  if (isResizeObserverError(e.reason?.message) || isResizeObserverError(e.reason)) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
  }
}, true);

const originalOnError = window.onerror;
window.onerror = (message, source, lineno, colno, error) => {
  if (isResizeObserverError(message)) {
    return true;
  }
  if (originalOnError) {
    return originalOnError(message, source, lineno, colno, error);
  }
  return false;
};

const queryClient = new QueryClient();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <LocaleProvider>
            <ToastProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ToastProvider>
          </LocaleProvider>
        </HashRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);