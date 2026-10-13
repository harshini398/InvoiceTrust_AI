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
          bg: '#0A0E17',        // Deep Midnight Obsidian
          surface: '#111827',   // Sleek Dark Slate Surface
          elevated: '#172236',  // Elevated Card Surface
          border: '#1E2D47',    // Refined Slate Navy Border
          accent: '#38BDF8',    // Electric Sky / Cyan
          'accent-hover': '#0EA5E9',
          paper: '#F8FAFC',     // Crisp Alabaster
          'paper-dark': '#E2E8F0',
          'dark-text': '#0F172A',
          muted: '#94A3B8',     // Sleek Muted Slate
          success: '#34D399',   // Vivid Emerald
          warning: '#FBBF24',   // Warm Amber
          error: '#F87171',     // Crimson
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 35px -5px rgba(56, 189, 248, 0.28)',
        'studio-panel': '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
