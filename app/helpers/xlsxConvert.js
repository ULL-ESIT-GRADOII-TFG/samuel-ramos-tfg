import xlsx from 'node-xlsx'
import { join } from 'path'

/**
* Funcion: convert(userTeams, user)
*
* Parámetros: file: fichero a convertir
*
* Descripción: Convierte el fichero xlsx a csv
*/
function convert (file) {
  const rows = []
  const obj = xlsx.parse(join(__dirname, file))

  let str = ''

  // Se meten los datos uno a uno por fila
  for (let i = 0; i < obj.length; i++) {
    let sheet = obj[i]
    for (let j = 0; j < sheet['data'].length; j++) {
      rows.push(sheet['data'][j])
    }
  }
  // Se añaden las comas
  for (let i = 0; i < rows.length; i++) {
    str += rows[i].join(',') + '\n'
  }
  return str
}

export default convert
