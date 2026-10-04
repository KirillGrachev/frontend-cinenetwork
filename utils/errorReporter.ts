/**
 * Minimal error-reporting seam.
 *
 * The app currently logs to the console; when Sentry (or any other service)
 * is provisioned, wire it here in ONE place — callers (ErrorBoundary,
 * global handlers, query cache) only know `reportError`.
 */

export type ErrorContext = Record<string, unknown>;

type Reporter = (error: unknown, context?: ErrorContext) => void;

const reporters: Reporter[] = [];

export function addErrorReporter(reporter: Reporter): () => void {
    reporters.push(reporter);
    return () => {
        const index = reporters.indexOf(reporter);
        if (index >= 0) reporters.splice(index, 1);
    };
}

export function reportError(error: unknown, context?: ErrorContext): void {
    for (const report of reporters) {
        try {
            report(error, context);
        } catch {
            // A broken reporter must never take down the error path itself.
        }
    }
    // Always log in DEV (even with reporters attached); in PROD the console
    // is the fallback only when no reporting service is wired.
    if (import.meta.env.DEV || reporters.length === 0) {
        console.error('[error]', context ?? '', error);
    }
}
