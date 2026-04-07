/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pug/**/*.pug', './src/**/*.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        'pt-serif': ['PT Serif', 'serif'], // Создаём новый класс font-pt-serif
        'serif': ['PT Serif', 'Georgia', 'serif'], // Или переопределяем стандартный serif
      },
      fontSize: {
        base: ['18 px', {lineHeight: '1.5'}],
      },
      colors: {
        'backgrondColors': {
        'mainBg': '#F9F6F0'
        },
        'fontColors': {
          'mainCol': '#2C2C2C',
          'accent': '#1A4A4C'
        }
      }
    },
  },
  plugins: [],
}