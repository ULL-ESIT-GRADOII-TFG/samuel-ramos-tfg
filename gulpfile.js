const gulp = require('gulp')
const fs = require('fs')
const sass = require('gulp-sass')

const dotenv = 'CLIENTID=' + '\nCLIENTSECRET=' + '\nCALLBACKURL='

gulp.task('default-env', () => {
  fs.writeFileSync('.env', dotenv)
})

gulp.task('sass', () => {
  return gulp.src('./public/custom.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
})

gulp.task('sass:watch', () => {
  gulp.watch('./public/custom.scss', ['sass'])
})
