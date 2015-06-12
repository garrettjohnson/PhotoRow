var gulp     = require('gulp');
var plugins  = require('gulp-load-plugins')();
var notifier = require('node-notifier');
var inlinesource = require('gulp-inline-source');

// error handler
// system notification, console log, emit end (so watch continues)
var onError = function(error) {
  notifier.notify({
    'title': 'Error',
    'message': 'Compilation failure.'
  });

  console.log(error);
  this.emit('end');
}

// minify html
gulp.task('html', function() {
  return gulp.src('src/markup/*.html')
    .pipe(plugins.plumber({ errorHandler: onError }))
    .pipe(plugins.htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest('./'))
    .pipe(plugins.connect.reload());
});

gulp.task('inline', function () {
    return gulp.src('*.html')
        .pipe(inlinesource())
        .pipe(gulp.dest('./'));
});

// compile and compress sass
gulp.task('sass', function() {
  return gulp.src('src/style/style.scss')
    .pipe(plugins.plumber({ errorHandler: onError }))
    .pipe(plugins.sass({ outputStyle: 'compressed' }))
    .pipe(plugins.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Explorer >= 9'], cascade: false }))
    .pipe(gulp.dest('./'))
    .pipe(plugins.connect.reload());
});

// concat and uglify scripts
gulp.task('scripts', function() {
  return gulp.src('src/scripts/*.js')
    .pipe(plugins.plumber({ errorHandler: onError }))
    .pipe(plugins.concat('scripts.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('./'))
    .pipe(plugins.connect.reload());
});

// minify all images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(plugins.plumber({ errorHandler: onError }))
    .pipe(plugins.imagemin({ progressive: true }))
    .pipe(gulp.dest('./images'))
    .pipe(plugins.connect.reload());
});

// start local server on port 3000
gulp.task('server', function() {
  return plugins.connect.server({
    root: './',
    port: 3000,
    livereload: true
  });
});

// watch sass and js files
gulp.task('watch', function() {
  gulp.watch('src/markup/*.html', ['html']);
  gulp.watch('src/style/*.scss', ['sass']);
  gulp.watch('src/scripts/*.js', ['scripts']);
  gulp.watch('src/images/**/*', ['images']);
});

// build and default task
gulp.task('build', ['html', 'sass', 'scripts', 'images']);
gulp.task('default', ['server', 'build', 'watch']);