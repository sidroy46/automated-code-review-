/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0B0F19',
        darkCard: '#111827',
        accentCyan: '#06b6d4',
        accentViolet: '#8b5cf6',
        accentIndigo: '#6366f1',
        accentBlue: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        futuristic: '0 0 25px rgba(99, 102, 241, 0.15)',
        glowingHover: '0 0 35px rgba(6, 182, 212, 0.35)',
        neonCyan: '0 0 15px rgba(6, 182, 212, 0.25)',
        neonViolet: '0 0 15px rgba(139, 92, 246, 0.25)',
      }
    },
  },
  plugins: [],
}
