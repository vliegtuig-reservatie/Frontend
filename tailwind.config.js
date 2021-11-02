// tailwind.config.js
module.exports = {
  mode: 'jit',

  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

  darkMode: 'media', // or 'class'

  theme: {
    extend: {
      fontFamily: {
        nunito: ['"Nunito"', 'sans-serif'],
      },
      colors: {
        blue: {
          xlight: '#F5F8FF',
          light: '#EAF0FF',
          DEFAULT: '#67A4FF',
          dark: '#277BFF',
        },
        neutral: {
          xlight:'#00335680',
          light: '#003356CC',
          DEFAULT: '#003356',
        }
      },
    },
  },

  variants: {
    extend: {},
  },

  plugins: [],
}