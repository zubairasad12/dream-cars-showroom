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
          bg: '#0B0B0A',            // Main background (70%)
          secondary: '#151514',     // Secondary background
          card: '#1D1C19',          // Card background
          cardHover: '#242320',     // Slightly elevated card
          border: '#30302D',        // Borders & dividers
          borderHover: '#C8A96B',   // Subtle gold border on hover
          primaryText: '#F4F2ED',   // Primary headings & text (20%)
          secondaryText: '#A6A39C', // Paragraphs & metadata
          gold: '#C8A96B',          // Champagne Gold Brand Accent (10%)
          goldLight: '#D8C08A',     // Light gold hover
          goldMuted: 'rgba(200, 169, 107, 0.15)',
          goldBorder: 'rgba(200, 169, 107, 0.35)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D8C08A 0%, #C8A96B 50%, #B69455 100%)',
        'gold-glow': 'radial-gradient(ellipse at top, rgba(200, 169, 107, 0.12), transparent 70%)',
      },
      boxShadow: {
        'subtle-card': '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
        'gold-subtle': '0 0 20px rgba(200, 169, 107, 0.15)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out forwards',
      }
    },
  },
  plugins: [],
}
