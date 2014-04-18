var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    bump = require('gulp-bump'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    git = require('gulp-git'),
    size = require('gulp-size'),
    pkg = require('./package.json');

var source = "jquery.gMaps.js",
    sourceMin = "jquery.gMaps.min.js";

gulp.task('lint', function () {
  return gulp.src(source)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build', ['lint'], function() {
  return gulp.src(source)
    .pipe(rename(sourceMin))
    .pipe(uglify({ preserveComments: 'some' }))
    .pipe(size())
    .pipe(gulp.dest('./'));
});

gulp.task('bump', function () {
  return gulp.src(['./bower.json', './component.json'])
    .pipe(bump({version: pkg.version}))
    .pipe(gulp.dest('./'));
});

gulp.task('tag', ['bump'], function () {
  return gulp.src('./')
    .pipe(git.commit('Version '+pkg.version))
    .pipe(git.tag(pkg.version, 'Version '+pkg.version))
    .pipe(git.push('origin', 'master', '--tags'))
    .pipe(gulp.dest('./'));
});
