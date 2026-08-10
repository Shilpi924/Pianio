/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Kid-friendly vibrant colors
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Fun rainbow colors for kids
        rainbow: {
          red: '#ef4444',
          orange: '#f97316',
          yellow: '#eab308',
          green: '#22c55e',
          blue: '#3b82f6',
          purple: '#a855f7',
          pink: '#ec4899',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        finger: {
          thumb: '#ef4444',
          index: '#f97316',
          middle: '#eab308',
          ring: '#22c55e',
          pinky: '#3b82f6',
        }
      },
      fontFamily: {
        'kid': ['"Comic Sans MS"', '"Chalkboard SE"', 'sans-serif'],
        'fun': ['"Fredoka"', '"Nunito"', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 30px rgba(249, 115, 22, 0.6)',
        'rainbow': '0 0 40px rgba(234, 88, 12, 0.4)',
      },
      animation: {
        'bounce-soft': 'bounce-soft 0.6s ease-in-out',
        'bounce-fun': 'bounce-fun 0.8s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'sparkle': 'sparkle 0.6s ease-out',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'pop': 'pop 0.3s ease-out',
        'rainbow': 'rainbow 3s linear infinite',
        'pulse-glow': 'pulse-glow 2.2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-fast': 'float 3.5s ease-in-out infinite',
      },
      keyframes: {
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'bounce-fun': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.1)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-8px)' },
          '75%': { transform: 'translateX(8px)' },
        },
        'sparkle': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.3)', opacity: '0.8' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'rainbow': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0px 0px rgba(34,211,238,0.0)', transform: 'scale(1)' },
          '50%': { boxShadow: '0 0 30px 8px rgba(34,211,238,0.55)', transform: 'scale(1.03)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-18px) translateX(8px)' },
        },
      },
    },
  },
  plugins: [],
}
