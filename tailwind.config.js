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
    },
  },
  plugins: [],
}