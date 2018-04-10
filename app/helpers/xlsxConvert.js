const xlsx = require('node-xlsx')
const path = require('path')
const rows = []

function convert (file) {
  const obj = xlsx.parse(path.join(__dirname, file))
  let str = ''

  for (let i = 0; i < obj.length; i++) {
    let sheet = obj[i]
    for (let j = 0; j < sheet['data'].length; j++) {
      rows.push(sheet['data'][j])
    }
  }
  for (let i = 0; i < rows.length; i++) {
    str += rows[i].join(',') + '\n'
  }
  return str
}

module.exports = convert
