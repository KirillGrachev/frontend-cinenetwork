/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './context/**/*.{js,ts,jsx,tsx}',
        './hooks/**/*.{js,ts,jsx,tsx}',
        './utils/**/*.{js,ts,jsx,tsx}',
        './services/**/*.{js,ts,jsx,tsx}',
        './data/**/*.{js,ts,jsx,tsx}',
        './store/**/*.{js,ts,jsx,tsx}',
        './locales/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter Variable', 'Inter', 'sans-serif'],
            },
            colors: {
                // Backgrounds
                'background-primary': '#050505', // Deepest black for main page backgrounds
                'background-secondary': '#0a0a0a', // Lighter for footers, modals, complex cards

                // Panels & Cards
                'panel-primary': '#111111', // Main panel/card background
                'panel-secondary': '#161616', // Lighter panel, hover states
                'panel-tertiary': '#222222', // Alternative hover, focus states

                // Items & Inputs
                'item-primary': '#1a1a1a', // Buttons, smaller items, inputs
                'item-secondary': '#252525', // Hover state for some items
                'input-primary': '#0f0f0f', // Specific for support form
                'input-focus': '#141414', // Specific for support form focus

                // Borders (using rgba for opacity control)
                'border-light': 'rgba(255, 255, 255, 0.05)', // 5%
                'border-medium': 'rgba(255, 255, 255, 0.1)', // 10%
                'border-strong': 'rgba(255, 255, 255, 0.2)', // 20%
                'border-focus': 'rgba(255, 255, 255, 0.3)', // 30%
            },
            keyframes: {
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            animation: {
                shimmer: 'shimmer 1.5s infinite',
            },
        },
    },
    plugins: [],
};
