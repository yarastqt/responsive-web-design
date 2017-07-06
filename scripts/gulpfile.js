'use strict'

/* eslint-disable no-unused-vars */
const dotenv = require('dotenv').config({ path: '../.env' })

const gulp = require('gulp')
const either = require('gulp-if')
const clean = require('gulp-clean')
const sequence = require('run-sequence')
const browserSync = require('browser-sync')
const htmlmin = require('gulp-htmlmin')
const postcss = require('gulp-postcss')
const babel = require('gulp-babel')
const uglify = require('gulp-uglifyjs')
const csso = require('gulp-csso')
const tinyPNG = require('gulp-tinypng')

const isProduction = process.env.NODE_ENV === 'production'
const server = browserSync.create()

gulp.task('server', () => {
    server.init({
        open: false,
        logFileChanges: false,
        server: {
            baseDir: '../build/'
        }
    })
})

gulp.task('css', () => (
    gulp.src('../src/css/*.css')
        .pipe(postcss())
        .pipe(either(isProduction, csso()))
        .pipe(gulp.dest('../build/assets/css'))
))

gulp.task('html', () => (
    gulp.src('../src/index.html')
        .pipe(either(isProduction, htmlmin({
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            sortAttributes: true,
            useShortDoctype: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyJS: true
        })))
        .pipe(gulp.dest('../build'))
))

gulp.task('js', () => (
    gulp.src(['../src/js/**/*.js', '!../src/js/vendor/*.js'])
        .pipe(either(isProduction, babel()))
        .pipe(either(isProduction, uglify()))
        .pipe(gulp.dest('../build/assets/js'))
))

gulp.task('vendor', () => (
    gulp.src('../src/js/vendor/*.js')
        .pipe(gulp.dest('../build/assets/js/vendor'))
))

gulp.task('image', () => (
    gulp.src('../src/i/**/*.{jpg,jpeg,png}')
        .pipe(either(isProduction, tinyPNG(process.env.TINYPNG_API_KEY)))
        .pipe(gulp.dest('../build/assets/i'))
))

gulp.task('clean', () => (
    gulp.src('../build', { read: false })
        .pipe(clean({ force: true }))
))

gulp.task('watch', () => {
    gulp.watch('../src/*.html', ['html'])
    gulp.watch('../src/css/*.css', ['css'])
    gulp.watch('../src/i/**/*.{jpg,jpeg,png}', ['image'])
    gulp.watch('../src/js/*.js', ['js'])
})

gulp.task('dev', () => {
    sequence('clean', [
        'html',
        'css',
        'js',
        'vendor',
        'image',
        'watch',
        'server'
    ])
})

gulp.task('prod', () => {
    sequence('clean', [
        'html',
        'css',
        'js',
        'vendor',
        'image'
    ])
})
