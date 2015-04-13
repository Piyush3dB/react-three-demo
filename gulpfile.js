/**
 * NB. The gulpfile isn't ES6 yet - looks like we need to wait for Gulp v0.4:
 * https://github.com/gulpjs/gulp/issues/830
 */

// Enable ES6 - this will make it automatically transpile required files. See: http://babeljs.io/docs/usage/require/
require('babel/register');

// TEMP fix for this issue: https://github.com/babel/babel/issues/489
Object.getPrototypeOf.toString = function() {return Object.toString();};

var gulp = require('gulp'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    fs = require('fs'),
    server = require('./server');

/**
 *  Transpile and concatenate the JavaScripts into dist/bundle.js
 */
gulp.task('babel', function() {

    /**
     * ,
     shim: {
                'three': { exports: 'global:THREE' },
                'bower_components/threejs/examples/js/loaders/ColladaLoader.js': { depends: {'three': null}, exports: 'global:THREE.ColladaLoader' }
            }
     */
    return browserify('./src/main.js', {
            debug: false
        })
        //.transform('browserify-shim')
        .transform(babelify.configure({
            extensions: ['.js']//,
            //ignore: 'bower_components'
        }))
        .bundle()
        .on('error', function (err) { console.log('Babelify error : ' + err.message); })
        .pipe(fs.createWriteStream('./dist/bundle.js'));

});

/**
 *  Compile and concatenate the SCSS files into dist/styles.css
 */
gulp.task('sass', function() {

    return gulp.src('./styles/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sourcemaps.write())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./dist'));

});

/**
 * Compile JS and SCSS
 */
gulp.task('compile', ['babel', 'sass'], function() {
});

/**
 * Compile and watch for changes
 */
gulp.task('watch', ['compile'], function() {
    gulp.watch('./src/**/*.js', ['babel']);
    gulp.watch('./styles/*.scss', ['sass']);
});

/**
 * Compile and start watching, then start the server
 */
gulp.task('server', ['watch'], function() {
    server.start();
});

/**
 * By default, runs the server task
 */
gulp.task('default', ['server'], function() {
});
