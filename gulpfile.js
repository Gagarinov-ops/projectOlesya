const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier');
const tailwindcss = require('tailwindcss');

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

function html() {
  const options = {
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      sortClassName: true,
      useShortDoctype: true,
      collapseWhitespace: true,
        minifyCSS: true,
        keepClosingSlash: true
    };
  return gulp.src('src/**/*.html')
    .pipe(plumber())
    .on('data', function(file) {
              const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options))
              return file.contents = buferFile
            })
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}));
}

function tailwindCss() {
  const plugins = [
    tailwindcss(),
    autoprefixer(),
    mediaquery(),
    cssnano()
  ];

  return gulp.src('src/styles/main.css')  // ← один файл
    .pipe(plumber())
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/css/'))         // → dist/css/main.css
    .pipe(browserSync.reload({stream: true}));
}

function css() {
  const plugins = [
    autoprefixer(),
    mediaquery(),
    cssnano()
  ];
    return gulp.src('src/blocks/**/*.css')
      .pipe(plumber())
      .pipe(concat('bundle.css'))
      .pipe(postcss(plugins))
      .pipe(gulp.dest('dist/'))
      .pipe(browserSync.reload({stream: true}));
}

function images() {
  return gulp.src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/styles/**/*.css'], tailwindCss); 
  gulp.watch(['src/blocks/**/*.css'], css);
  gulp.watch(['src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['tailwind.config.js'], tailwindCss);
}

const build = gulp.series(clean, gulp.parallel(html, tailwindCss, css, images));
const watchapp = gulp.parallel(build, watchFiles, serve);  

exports.clean = clean;
exports.css = css;
exports.tailwindCss = tailwindCss;
exports.html = html;
exports.images = images;

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;