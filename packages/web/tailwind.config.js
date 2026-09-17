/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#090d16',
        darkCard: '#111726',
        darkBorder: '#1e293b',
        neonCyan: '#06b6d4',
        neonRose: '#f43f5e',
        neonIndigo: '#6366f1',
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.35)',
        'glow-rose': '0 0 25px rgba(244, 63, 94, 0.35)',
        'glow-indigo': '0 0 30px rgba(99, 102, 241, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pop-in': 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
