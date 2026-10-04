import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // happy-dom instead of jsdom: faster startup and no native-Node
        // version coupling (jsdom 30 pulled undici builds that crash on
        // older Node 20 runtimes).
        environment: 'happy-dom',
        globals: true,
        include: ['**/*.test.ts', '**/*.test.tsx'],
        setupFiles: ['./vitest.setup.ts'],
        // Mock providers simulate network latency (up to 800 ms); page-level
        // tests await real data, so the default 5 s is kept but bumped a bit.
        testTimeout: 15_000,
        css: false,
        coverage: {
            provider: 'v8',
            // Count EVERY source file, not just the ones tests happened to
            // import — otherwise the percentage flatters untouched modules.
            include: [
                'App.tsx',
                'index.tsx',
                'constants.ts',
                'routes.ts',
                'components/**/*.{ts,tsx}',
                'context/**/*.{ts,tsx}',
                'hooks/**/*.{ts,tsx}',
                'mappers/**/*.ts',
                'services/**/*.ts',
                'store/**/*.ts',
                'utils/**/*.ts',
                'types/**/*.ts',
            ],
            exclude: [
                '**/*.test.{ts,tsx}',
                'types/**', // compile-time only: interfaces/enums emit no runtime code
            ],
            reporter: ['text-summary', 'json-summary', 'html'],
            /**
             * Ratchet thresholds: well-covered layers must not regress.
             * Raise them as coverage of hooks/components grows.
             */
            thresholds: {
                'store/**': { statements: 90 },
                'mappers/**': { statements: 80 },
                'context/**': { statements: 75 },
                'utils/**': { statements: 45 },
            },
        },
    },
});
