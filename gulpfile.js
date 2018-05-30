// load the require modules
let gulp         = require('gulp');
let sass         = require('gulp-sass');
let uglify       = require('gulp-uglify');
let concat       = require('gulp-concat');
let autoprefixer = require('gulp-autoprefixer');
let browserSync  = require('browser-sync').create();
let imagemin     = require('gulp-imagemin');
let cleanCSS     = require('gulp-clean-css'); // Not required with sass
let plumber      = require('gulp-plumber');
let sourcemaps   = require('gulp-sourcemaps');

// File paths
let SCRIPTS_PATH = 'src/js/**/*.js';
let CSS_PATH = 'src/scss/**/*.scss';

// Translate SASS to CSS
gulp.task('sass', function(){
  return gulp.src(['src/scss/reset.scss', CSS_PATH])
    .pipe(plumber(function(err) {
      console.log('Style task error');
      console.log(err);
      this.emit('end');
    })) // Keep gulp watch running even if the an error
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
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

// image minification -- only changes if necessary
gulp.task('imagemin', function(){
  var img_src = 'src/images/*';
  var img_dest = 'app/images';
  gulp.src(img_src)
  // .pipe(changed(img_dest))
  .pipe(imagemin())
  .pipe(gulp.dest(img_dest));
});


// Watcher to rerun gulp on save
gulp.task('default', ['browserSync', 'sass', 'imagemin'], function(){
  gulp.watch(CSS_PATH, ['sass']);
  // Other watchers
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch(SCRIPTS_PATH, ['scripts'], browserSync.reload);
})
// Watcher to rerun gulp on save
gulp.task('watch', ['browserSync', 'sass', 'imagemin'], function(){
  gulp.watch(CSS_PATH, ['sass']);
  // Other watchers
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch(SCRIPTS_PATH, browserSync.reload);
})

// Setting up a web server for auto browser reload
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})
