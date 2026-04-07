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

function serve() {
  browserSync.init({
    server: { baseDir: './dist' },
    open: false
  });
}

function compilePug() {
  return gulp.src('src/pug/pages/**/*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true,
      basedir: './src/pug'
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}));
}

function fonts() {
  return gulp.src('src/assets/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.reload({stream: true}));
}

function assets() {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'))
    .pipe(browserSync.reload({stream: true}));
}

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

function images() {
  // Копируем ВСЕ файлы из папки images
  return gulp.src('src/images/**/*', { encoding: false })
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['src/pug/**/*.pug'], compilePug);
  gulp.watch(['src/styles/**/*.css'], tailwindCss); 
  gulp.watch(['src/blocks/**/*.css'], customCss);
  gulp.watch(['src/images/**/*'], images);
  gulp.watch(['src/assets/**/*'], assets);
  gulp.watch(['tailwind.config.js'], tailwindCss);
}

const build = gulp.series(clean, gulp.parallel(compilePug, tailwindCss, customCss, images, assets, fonts));
const watchapp = gulp.parallel(build, watchFiles, serve);

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