var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify')
    gutil = require('gulp-util');

gulp.task('gmaps', function() {
  // Minify and concat JS
  gulp.src('jquery.gMaps.js')
    .pipe(rename('jquery.gMaps.min.js'))
    .pipe(uglify({ preserveComments: 'some' }))
    .pipe(gulp.dest(''))
    .pipe(notify({ message: 'gMaps task complete.' }));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('jquery.gMaps.js', ['gmaps']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['gmaps']);
