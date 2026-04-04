const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const tailwindcss = require('tailwindcss');
const pug = require('gulp-pug');

// Сервер с автообновлением
function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

// Компиляция Pug в HTML
function compilePug() {
  return gulp.src('src/pug/pages/**/*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true,           // Красивый HTML для разработки
      basedir: './src/pug'    // Базовая директория для includes/extends
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}));
}

// Копирование шрифтов
function fonts() {
  return gulp.src('src/assets/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.reload({stream: true}));
}

// Копирование остальных ассетов (иконки, файлы и т.д.)
function assets() {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'))
    .pipe(browserSync.reload({stream: true}));
}

function customCss() {
  return gulp.src('src/blocks/**/*.css')     // ← БЭМ блоки
    .pipe(concat('custom.css'))
    .pipe(gulp.dest('dist/css/'));
}

// Tailwind CSS
function tailwindCss() {
  const plugins = [
    tailwindcss(),
    autoprefixer(),
    mediaquery(),
    cssnano()
  ];

  return gulp.src('src/styles/main.css')
    .pipe(plumber())
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/css/'))       
    .pipe(browserSync.reload({stream: true}));
}

// Кастомные CSS блоки
function customCss() {
  const plugins = [
    autoprefixer(),
    mediaquery(),
    cssnano()
  ];
  return gulp.src('src/blocks/**/*.css')
    .pipe(plumber())
    .pipe(concat('custom.css'))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.reload({stream: true}));
}

// Копирование изображений
function images() {
  return gulp.src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({stream: true}));
}

// Очистка папки dist
function clean() {
  return del('dist');
}

// Отслеживание изменений
function watchFiles() {
  gulp.watch(['src/pug/**/*.pug'], compilePug);
  gulp.watch(['src/styles/**/*.css'], tailwindCss); 
  gulp.watch(['src/blocks/**/*.css'], customCss);
  gulp.watch(['src/images/**/*'], images);
  gulp.watch(['src/assets/**/*'], assets);
  gulp.watch(['tailwind.config.js'], tailwindCss);
}

// Сборка проекта
const build = gulp.series(clean, gulp.parallel(compilePug, tailwindCss, customCss, images, assets, fonts));

// Режим разработки
const watchapp = gulp.parallel(build, watchFiles, serve);

// Экспорт задач
exports.clean = clean;
exports.customCss = customCss;
exports.tailwindCss = tailwindCss;
exports.compilePug = compilePug;
exports.images = images;
exports.assets = assets;
exports.fonts = fonts;
exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;