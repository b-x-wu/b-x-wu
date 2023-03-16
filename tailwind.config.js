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
      'blue': '#90E0EF',
      'light-blue': '#ADE8F4',
      'lighter-blue': '#E8FBFF',
      'dim-gray': '#454545',
      'light-gray': '#E1EDF8'
    }
  },
  plugins: [],
}
