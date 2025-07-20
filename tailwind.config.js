/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta baseada na imagem de fundo (tons rosa, bege, dourado)
        primary: {
          50: '#fdf4f0',
          100: '#fae6db',
          200: '#f5ccb7',
          300: '#eba888',
          400: '#df7d57',
          500: '#d35d3a',
          600: '#c4472f',
          700: '#a3372a',
          800: '#842f28',
          900: '#6b2a26',
        },
        secondary: {
          50: '#fef7ed',
          100: '#fdebd4',
          200: '#fbd4a8',
          300: '#f7b572',
          400: '#f28d3a',
          500: '#ee6f18',
          600: '#df560e',
          700: '#b8400e',
          800: '#943214',
          900: '#792b14',
        },
        accent: {
          50: '#fff9f0',
          100: '#ffeee0',
          200: '#ffdbb6',
          300: '#ffc182',
          400: '#ff9b4c',
          500: '#fe7a26',
          600: '#ef5f0c',
          700: '#c6470c',
          800: '#9d3912',
          900: '#7e3012',
        },
        background: {
          cream: '#faf7f2',
          light: '#fefcf9',
          dark: '#2c2c2c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'main-bg': "url('/fundo-background.png')",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
