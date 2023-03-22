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
      'dark-blue': '#0077B6',
      'blue': '#90E0EF',
      'light-blue': '#ADE8F4',
      'lighter-blue': '#E8FBFF',
      'glacier': '#EBF4FF',
      'dim-gray': '#454545',
      'light-gray': '#E1EDF8'
    }
  },
  plugins: [],
}
