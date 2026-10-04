import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/**
 * Flat ESLint config.
 *
 * Uses the non-type-checked TS preset on purpose: full type-aware linting
 * (`recommendedTypeChecked`) OOMs on this repo's large locale dictionaries,
 * and every type-level guarantee it would add is already enforced by
 * `tsc --noEmit` (strict) via the `typecheck` script / CI.
 */
export default tseslint.config(
    { ignores: ['dist', 'node_modules', 'coverage', 'collect.cjs', 'vendor/**', 'public/**'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
            ],
            'no-console': ['warn', { allow: ['warn', 'error'] }],
        },
    },
    {
        // Node-side tooling files
        files: ['*.config.{ts,js}', 'scripts/**/*.{js,mjs,cjs}'],
        languageOptions: { globals: globals.node },
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
    {
        // Tests: vitest globals + relaxed stylistic pressure
        files: ['**/*.test.{ts,tsx}'],
        languageOptions: { globals: { ...globals.node } },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
);
