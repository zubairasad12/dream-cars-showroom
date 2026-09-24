/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          bg: '#090A0E',
          card: '#111319',
          cardHover: '#161922',
          surface: '#1A1D27',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.2)',
          red: '#E11D48',
          redHover: '#BE123C',
          redGlow: 'rgba(225, 29, 72, 0.25)',
          silver: '#E2E8F0',
          silverMuted: '#94A3B8',
          darkMuted: '#64748B',
          gold: '#F59E0B',
          carbon: '#1E212B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'luxury-glow': 'radial-gradient(ellipse at top, rgba(225, 29, 72, 0.12), transparent 70%)',
        'carbon-pattern': 'linear-gradient(45deg, #111 25%, transparent 25%), linear-gradient(-45deg, #111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111 75%), linear-gradient(-45deg, transparent 75%, #111 75%)'
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        'luxury-red': '0 10px 30px -10px rgba(225, 29, 72, 0.35)',
        'card-glow': '0 0 25px rgba(255, 255, 255, 0.03)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(225, 29, 72, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(225, 29, 72, 0.8)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        pulseGlow: 'pulseGlow 2.5s infinite',
      }
    },
  },
  plugins: [],
}
