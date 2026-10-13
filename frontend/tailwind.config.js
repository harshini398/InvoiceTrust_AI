/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#101915',        // Primary background
          surface: '#182821',   // Secondary dark surface
          elevated: '#1F342B',  // Elevated dark surface
          border: '#263D33',    // Subtle border
          accent: '#D9F99D',    // Primary accent (lime)
          'accent-hover': '#C7EE84',
          paper: '#F4F5F0',     // Main light surface
          'paper-dark': '#E6E7E0',
          'dark-text': '#172019',
          muted: '#89948C',     // Secondary muted text
          success: '#86EFAC',
          warning: '#FBBF24',
          error: '#F87171',
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'lime-glow': '0 0 35px -5px rgba(217, 249, 157, 0.25)',
        'studio-panel': '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
