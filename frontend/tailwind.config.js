/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        neon: {
          DEFAULT: '#00F59B',
          hover: '#00DC8C',
          muted: 'rgba(0, 245, 155, 0.15)',
        },
        navy: {
          950: '#060913',
          900: '#090e1f',
          850: '#0c142b',
          800: '#111b38',
          750: '#172449',
          700: '#1e2f5d',
        },
      },
      boxShadow: {
        'neon': '0 0 25px rgba(0, 245, 155, 0.25)',
        'blue-glow': '0 0 50px rgba(37, 99, 235, 0.25)',
        'purple-glow': '0 0 45px rgba(168, 85, 247, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
