var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    rigger = require('gulp-rigger'),
    browserSync = require('browser-sync').create(),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    del = require('del'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css');

gulp.task('clean', function () {
    return del(['build']);
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: './build',
            directory: true
        },
        open: false,
        browser: 'google chrome',
        port: 3000,
        files: ['./build/**/*.*']
    });
});

gulp.task('html', function () {
    gulp.src('./app/*.html')
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest('./build/'))
});

gulp.task('cssLibs', function () {
    gulp.src('./app/styles/libs/*.css')
        .pipe(concatCss("vendor.css"))
        .pipe(gulp.dest('./build/styles/'))
});

gulp.task('js', function () {
    var bundler = browserify('./app/js/main.js', {debug: true}).transform(babelify, {presets: ['es2015']});

    return bundler.bundle()
        .pipe(source('build.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./build/js'))
});

gulp.task('jsProd', function () {
    var bundler = browserify('./app/js/main.js', {debug: false}).transform(babelify, {presets: ['es2015']});

    return bundler.bundle()
        .pipe(plumber())
        .pipe(source('build.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
});

gulp.task('jsLibs', function () {
    gulp.src('./app/js/libs/*.js')
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./build/js/'))
});

gulp.task('watch', function () {
    gulp.watch('./app/*.html', ['html']);

    gulp.watch('./app/styles/libs/*.css', ['cssLibs']);

    gulp.watch('./app/js/*.js', ['js']);
    gulp.watch('./app/js/libs/*.js', ['jsLibs']);
});

gulp.task('build', function (callback) {
    runSequence(
        'clean',
        [
            'html',
            'cssLibs',
            'jsProd',
            'jsLibs'
        ],
        callback
    );
});

gulp.task('dev', function (callback) {
    runSequence(
        'clean',
        [
            'html',
            'cssLibs',
            'js',
            'jsLibs'
        ],
        'watch',
        'browserSync',
        callback
    );
});