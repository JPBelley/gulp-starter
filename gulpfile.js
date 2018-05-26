// load the require modules
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
// À compléter
// var babel = require("gulp-babel");


// Translate SASS to CSS
gulp.task('sass', function(){
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(autoprefixer())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('app/css/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Javascript
gulp.task('scripts', function(){
  return gulp.src('src/js/*.js')
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
  gulp.watch('src/scss/**/*.scss', ['sass']);
  // Other watchers
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
})
// Watcher to rerun gulp on save
gulp.task('watch', ['browserSync', 'sass', 'imagemin'], function(){
  gulp.watch('src/scss/**/*.scss', ['sass']);
  // Other watchers
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
})

// Setting up a web server for auto browser reload
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})
