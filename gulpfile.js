// load the require modules
let gulp           = require('gulp');
let sass           = require('gulp-sass');
let uglify         = require('gulp-uglify');
let concat         = require('gulp-concat');
let autoprefixer   = require('gulp-autoprefixer');
let browserSync    = require('browser-sync').create();
let cleanCSS       = require('gulp-clean-css'); // Not required with sass
let plumber        = require('gulp-plumber');
let sourcemaps     = require('gulp-sourcemaps');
let babel          = require('gulp-babel');

// handlebars plugins
let handlebars     = require('gulp-handlebars');
let handlebarsLibs = require('handlebars');
let declare        = require('gulp-declare');
let wrap           = require('gulp-wrap');

// Image minification
let imagemin       = require('gulp-imagemin');
let imageminPng    = require('imagemin-pngquant');
let imageminJpeg   = require('imagemin-jpeg-recompress');

// File paths
let SCRIPTS_PATH   = 'src/js/**/*.js';
let CSS_PATH       = 'src/scss/**/*.scss';
let TEMPLATES_PATH = 'src/templates/**/*.hbs';
let IMAGES_PATH    = 'src/images/**/*.{png,jpeg,jpg,svg,gif}';

// Translate SASS to CSS
gulp.task('sass', function(){
  return gulp.src(['src/scss/reset.scss', CSS_PATH])
    .pipe(plumber(function(err) {
      console.log('Style task error');
      console.log(err);
      this.emit('end');
    })) // Keep gulp watch running even if there's an error
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    })) // Converts Sass to CSS with gulp-sass
    .pipe(autoprefixer())
    // .pipe(concat('style.css'))
    // .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Javascript
gulp.task('scripts', function(){
  return gulp.src(SCRIPTS_PATH)
    .pipe(plumber(function(err) {
      console.log('Scripts task error');
      console.log(err);
      this.emit('end');
    })) // Keep gulp watch running even if there's an error
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// image minification -- only changes if necessary
gulp.task('imagemin', function(){
  var img_dest = 'app/images';
  gulp.src(IMAGES_PATH)
  .pipe(imagemin(
    [
      imagemin.gifsicle(),
      imagemin.jpegtran(),
      imagemin.optipng(),
      imagemin.svgo(),
      imageminPng(),
      imageminJpeg()
    ]
  ))
  .pipe(gulp.dest(img_dest));
});

// Templates with handlebars
gulp.task('templates', function(){
    return gulp.src(TEMPLATES_PATH)
    .pipe(handlebars({
      handlebars: handlebarsLibs
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'templates',
      noRedeclare: true
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('app/'))
});

// Watcher to rerun gulp on save
gulp.task('default', ['browserSync', 'sass', 'imagemin', 'scripts'], function(){
  gulp.watch(CSS_PATH, ['sass']);
  // Other watchers
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch(SCRIPTS_PATH, ['scripts']);
  gulp.watch(TEMPLATES_PATH, ['templates']);
})

// Watcher to rerun gulp on save
gulp.task('watch', ['browserSync', 'sass', 'imagemin', 'scripts'], function(){
  gulp.watch(CSS_PATH, ['sass']);
  // Other watchers
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch(SCRIPTS_PATH, ['scripts']);
})

// Setting up a web server for auto browser reload
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})
