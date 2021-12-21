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
    boxShadow: {
      DEFAULT: '0 8px 16px 0 rgba(68, 117, 141, 0.08)'
    },
    gridTemplateColumns: {
      DEFAULT: '1fr 2fr 3fr 3fr 3fr',
      small: 'repeat(2,minmax(0,1fr))',
      xsmall: 'repeat(2,minmax(0,1fr))'
    },
    stroke: theme => ({
      'blue': theme('colors.blue.light')
    }),
    animation: {
      'pulse-slow': 'pulse 2s linear infinite',
      'pulse-fast': 'pulse 1.5s linear infinite',
    }
  },

  variants: {
    extend: {},
  },

  plugins: [],
}