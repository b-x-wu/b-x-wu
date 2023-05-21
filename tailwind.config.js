/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
          'magicalText-background-pan': {
              '0%': { backgroundPosition: '0% center' },
              '100%': { backgroundPosition: '-200% center' },
          },
          'magicalText-scale': {
              '0%,100%': { 'transform': 'scale(0)' },
              '50%': { 'transform': 'scale(1)' }
          },
          'magicalText-rotate': {
              '0%': { 'transform': 'rotate(0deg)' },
              '100%': { 'transform': 'rotate(180deg)' }
          }
      },
      fontFamily: {
        titanOne: ['var(--font-titan-one)'],
        shareTechMono: ['var(--font-share-tech-mono)']
      }
    },
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
