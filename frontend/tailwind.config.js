/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ['./templates/frontend/*.html', "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontSize: {
      sm: '0.800rem',
      base: '1rem',
      xl: '1.250rem',
      '2xl': '1.563rem',
      '3xl': '1.954rem',
      '4xl': '2.442rem',
      '5xl': '3.053rem',
    },
    fontFamily: {
      heading: ['"Corben"', ...defaultTheme.fontFamily.sans],
      body: ['"Corben"', ...defaultTheme.fontFamily.sans],
    },
    fontWeight: {
      normal: '400',
      bold: '700',
    },
    extend: {
      colors: {
        'text': '#121413',
        'background': '#f4f8f6',
        'primary': '#5cba95',
        'secondary': '#8ce1c0',
        'accent': '#4ee9ac',
       },
    },
    animation: {
      blob: "blob 7s infinite",
    },
    keyframes: {
      blob: {
        "0%": {
          transform: "translate(0px, 0px) scale(1)",
        },
        "33%": {
          transform: "translate(30px, -50px) scale(1.1)",
        },
        "66%": {
          transform: "translate(-20px, 20px) scale(0.9)",
        },
        "100%": {
          transform: "tranlate(0px, 0px) scale(1)",
        },
      },
    },
  },
  plugins: [],
}

