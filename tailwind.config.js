/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    screens:{
      'sm':'330px',
      'md':'880px'
    },
    extend: {},
  },
  plugins: [],
}

