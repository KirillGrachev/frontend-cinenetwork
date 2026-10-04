import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react-router') || id.includes('@remix-run')) {
                            return 'vendor-router';
                        }
                        if (id.includes('react-dom')) {
                            return 'vendor-react-dom';
                        }
                        if (id.includes('react')) {
                            return 'vendor-react-core';
                        }
                        if (id.includes('@headlessui') || id.includes('motion')) {
                            return 'vendor-ui';
                        }
                        if (
                            id.includes('@tanstack') ||
                            id.includes('zustand') ||
                            id.includes('react-hook-form') ||
                            id.includes('zod')
                        ) {
                            return 'vendor-state';
                        }
                        if (
                            id.includes('date-fns') ||
                            id.includes('dompurify') ||
                            id.includes('react-virtuoso')
                        ) {
                            return 'vendor-utils';
                        }
                        return 'vendor-others';
                    }
                },
            },
        },
    },
});
