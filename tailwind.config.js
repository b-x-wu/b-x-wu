/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    listStyleType: {
      decimal: 'decimal',
      square: 'square'
    },
    colors: {
      'darkest-blue': '#000E14',
      'darker-blue': '#001520',
      'dark-blue': '#0077B6',
      'blue': '#90E0EF',
      'light-blue': '#ADE8F4',
      'lighter-blue': '#E8FBFF',
      'glacier': '#EBF4FF',
      'dim-gray': '#454545',
      'light-gray': '#DBE9F4',
      'transparent': '#0000'
    }
  },
  darkMode: 'class',
  plugins: [],
}
