/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          950: '#060608',
          900: '#0c0c10',
          850: '#111116',
          800: '#17171e',
          700: '#22222c',
        },
        copper: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          glow: 'rgba(234, 88, 12, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-copper': '0 0 50px -10px rgba(249, 115, 22, 0.25)',
        'glow-subtle': '0 0 30px -5px rgba(255, 255, 255, 0.05)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
