/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9f6f0',
          100: '#f2e9d9',
          200: '#e5d1b3',
          300: '#d1b285',
          400: '#bc905c',
          500: '#a87541',
          600: '#946036',
          700: '#7a4d2e',
          800: '#643f29',
          900: '#533525',
          950: '#2d1b13',
        },
        gold: {
          50: '#fdfce9',
          100: '#fbf8c5',
          200: '#f7f18e',
          300: '#f1e24d',
          400: '#e9ce1d',
          500: '#d4b312',
          600: '#b78c0e',
          700: '#92660f',
          800: '#795113',
          900: '#674415',
          950: '#3c2408',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      }
    },
  },
  plugins: [],
}
