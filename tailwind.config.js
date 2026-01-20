/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                sage: {
                    50: '#f4f7f4',
                    100: '#e6ede6',
                    200: '#ceddce',
                    300: '#a7bea7',
                    400: '#7b987b',
                    500: '#5c7a5c',
                    600: '#486148',
                    700: '#3b4e3b',
                    800: '#313f31',
                    900: '#2a352a',
                    950: '#161d16',
                },
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'orb-glow': 'orb-glow 4s ease-in-out infinite',
            },
            keyframes: {
                'orb-glow': {
                    '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
                    '50%': { transform: 'scale(1.1)', opacity: '0.8' },
                }
            },
        },
    },
    plugins: [],
}
