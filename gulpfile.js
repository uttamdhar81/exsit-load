const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const purgecss = require('gulp-purgecss');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();

// Compile and purge SCSS
function scssTask() {
  return src('src/scss/main.scss')
    .pipe(sass())
    .pipe(purgecss({
      content: ['src/**/*.html', 'src/js/**/*.js'],
      safelist: [/^show$/, /^collapse$/, /^modal/]
    }))
    .pipe(cleanCSS())
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

// JS Task
function jsTask() {
  return src('src/js/**/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
}

// HTML Task
function htmlTask() {
  return src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'));
}

// Copy images
function imagesTask() {
  return src('src/images/**/*')
    .pipe(dest('dist/images'));
}

// Copy fonts
function fontsTask() {
  return src('src/fonts/**/*')
    .pipe(dest('dist/fonts'));
}

// Live server
function serve() {
  browserSync.init({ server: { baseDir: 'dist' } });
  watch('src/scss/**/*.scss', scssTask);
  watch('src/js/**/*.js', jsTask);
  watch('src/*.html', htmlTask).on('change', browserSync.reload);
  watch('src/images/**/*', imagesTask).on('change', browserSync.reload);
  watch('src/fonts/**/*', fontsTask).on('change', browserSync.reload);
}

exports.default = series(
  parallel(scssTask, jsTask, htmlTask, imagesTask, fontsTask),
  serve
);

exports.build = series(
  parallel(scssTask, jsTask, htmlTask, imagesTask, fontsTask)
);
