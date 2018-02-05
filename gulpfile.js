const gulp = require('gulp')
const fs = require('fs')

const dotenv = 'CLIENTID=' + '\nCLIENTSECRET=' + '\nCALLBACKURL='

gulp.task('default-env', () => {
  fs.writeFileSync('.env', dotenv)
})
