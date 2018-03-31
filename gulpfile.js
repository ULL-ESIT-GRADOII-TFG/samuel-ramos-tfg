const gulp = require('gulp')
const fs = require('fs')
const sass = require('gulp-sass')
const open = require('gulp-open')
const browserSync = require('browser-sync').create()
const nodemon = require('gulp-nodemon')

const dotenv = 'CLIENTID=' + '\nCLIENTSECRET=' + '\nCALLBACKURL=' + '\n\nTOKENFORTEST='

// Tarea para escribir el fichero .env
gulp.task('default-env', () => {
  fs.writeFileSync('.env', dotenv)
})

// Tarea para compilar saaas
gulp.task('sass', () => {
  return gulp.src('./public/custom.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
})

// Tarea para compilar saaas
gulp.task('sass:watch', () => {
  gulp.watch('./public/custom.scss', ['sass'])
})

// Taraa para abrir en el navegador
gulp.task('open', () => {
  gulp.src(__filename)
  .pipe(open({ uri: 'http://localhost:8081' }))
})

// Tarea para nodemon
gulp.task('browser-sync', ['nodemon'], () => {
  browserSync.init(null, {
    proxy: 'http://localhost:3000',
    files: ['views/*.ejs', 'public/js/*.js', 'public/css/*.css'],
    port: 2121
  })
})

// Tarea nodemon
gulp.task('nodemon', (cb) => {
  var started = false
  return nodemon({
    script: 'npm start'
  }).on('start', () => {
    if (!started) {
      cb()
      started = true
    }
  })
})
