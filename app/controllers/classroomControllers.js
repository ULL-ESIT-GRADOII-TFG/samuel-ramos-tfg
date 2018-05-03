import User from '../models/user'
import Org from '../models/org'
import Assign from '../models/assign'
import Student from '../models/student'

import multer from 'multer'
import csvjson from 'csvjson'
import path from 'path'
import fs from 'fs'

import Github from '../helpers/githubHelper'
import xlsx from '../helpers/xlsxConvert'

// Multer config
const storage = multer.diskStorage({
  // Destino donde se guardarán los ficheros
  destination: './public/files/',
  // Función que retorna un callback para darle nombre al fichero.
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

// Middleware para el fichero
const upload = multer({
  // Tipo de almacenamiento
  storage: storage,
  // Limite el fichero: 100mb
  limits: { fileSize: 1000000 },
  // Función que comprueba la extensión del archivo
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
}).single('csv')

function checkFileType (file, cb) {
  // Expresiones regulares
  const fileTypes = /csv|xlsx/
  const mimeTypes = /csv|spreadsheetml/

  // Match de las regexp
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = mimeTypes.test(file.mimetype)

  // Comprobación para ver que las extensiones eran correctas
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    return cb(new Error('Solo CSV'))
  }
}

/**
* Funcion: classrooms(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Renderiza la vista de classrooms
*/
async function classrooms (req, res) {
  try {
    // Se solicita la información de la organización
    let org = await Org.find({ 'ownerLogin': req.user.username })
    res.render('classroom/classrooms', { titulo: 'Aulas', usuario: req.user, aulas: org })
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: classrooms(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Renderiza la vista de classrooms
*/
async function orgs (req, res) {
  try {
    // Se consulta la información el usuario
    let user = await User.findOne({ 'login': req.user.username })
    // Se inicializa la API
    const ghUser = new Github(user.token)
    // Se obtienen las organizaciones del usuario
    let result = await ghUser.userOrgs()

    res.render('classroom/orgs', { titulo: 'Organizaciones', usuario: req.user, orgs: result.data })
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: orgsP(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Crea el aula
*/
async function orgsP (req, res, next) {
  let data = req.body.data.split('@')
  let idOrg = data[0]
  let loginOrg = data[1]
  let avatarUrl = data[2]

  try {
    // Se crea el objeto de la organizacion
    let newOrg = new Org({
      login: loginOrg,
      id: idOrg,
      avatarUrl: avatarUrl,
      ownerId: req.user.id,
      ownerLogin: req.user.username,
      isActive: true
    })

    // Se guarda en base de datos
    await newOrg.save()
    res.redirect('/classrooms')
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: classroom(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Renderiza los datos de un aula
*/
async function classroom (req, res) {
  let idOrg = req.params.idclass
  let titulo = 'Aula: ' + idOrg
  try {
    // Hacemos la consulta del aula
    let org = await Org.findOne({ 'login': idOrg })
    // Consultamos las assigns
    let assigns = await Assign.find({ 'orgLogin': idOrg })

    // Comprobamos si el usuario activo es el
    if (org.ownerLogin === req.user.username) {
      res.render('classroom/classroom', { titulo: titulo, usuario: req.user, classroom: idOrg, assign: assigns })
    } else {
      res.redirect('/classrooms')
    }
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: invi(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Renderiza la invitacion a un aula
*/
function invi (req, res) {
  let idOrg = req.params.idclass
  let titulo = 'Invitacion para ' + idOrg

  res.render('classroom/invitation', { titulo: titulo, usuario: req.user, classroom: idOrg })
}

/**
* Funcion: inviP(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Gestiona la invitacion a un aula
*/
async function inviP (req, res) {
  let org = req.params.idclass
  let titulo = 'Aula: ' + org
  try {
    // Se hace la busqueda del aula
    let orgs = await Org.findOne({ 'login': org })
    // Se hace la busqueda del usuario
    let user = await User.findOne({ 'login': org.ownerLogin })

    // Se comprueba si las invitaciones están activas
    if (!org.isActive) {
      return res.render('static_pages/error2', { titulo: 'Error', usuario: req.user, msg: 'Ya no puedes aceptar esta tarea, está deshabilitado.' })
    } else {
      // Se inicializa la Github APU
      const ghUser = new Github(user.token)

      // Se añade el usuario a la organización
      await ghUser.addUserOrg(orgs.login, req.user.username)
      res.render('classroom/classroom', { titulo: titulo, usuario: req.user })
    }
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: options(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Renderiza la vista de las opciones del aula
*/
async function options (req, res) {
  let aula = req.params.idclass

  try {
    // Se busca la organizacion
    let org = await Org.findOne({ 'login': aula })

    // Se comprueba que el usuario activo es el dueño
    if (org.ownerLogin === req.user.username) {
      res.render('classroom/options', { titulo: 'Opciones', usuario: req.user, classroom: aula, activado: org.isActive })
    } else {
      res.redirect('/classrooms')
    }
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: optionsP(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Geistiona las opciones del aula
*/
async function optionsP (req, res) {
  let aula = req.params.idclass

  try {
    // Comprobamos si la invitación está activa
    if (req.body.activador) {
      await Org.findOneAndUpdate({ login: aula }, { isActive: true })
    } else {
      await Org.findOneAndUpdate({ login: aula }, { isActive: false })
    }
    res.redirect('/classroom/' + aula)
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: file(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Gestiona la subida del fichero de alumnos
*/
function file (req, res) {
  let aula = req.params.idclass

  // Función middleware que gestiona todo.
  upload(req, res, err => {
    if (err) return res.render('static_pages/error2', { titulo: 'Error', usuario: req.user, msg: 'Sólo se pueden ficheros con formato csv' })

    // Comprobamos si se trata de un fichero csv o xlsx
    if (path.extname(req.file.filename) === '.csv') {
      // En caso de CSV
      // Seteamos las opciones
      const options = {
        delimiter: /[,|;]+/,
        headers: 'name,surname,email,idGithub,orgName'
      }
      let file
      try {
        // Leemos el fichero de donde se subió
        let data = fs.readFileSync(path.join(__dirname, '../../public/files/' + req.file.filename), { encoding: 'utf8' })
        // Lo convertimos a JSON
        file = csvjson.toObject(data, options)
      } catch (error) {
        return res.render('static_pages/error2', { titulo: 'Error', usuario: req.user, msg: 'Sube un fichero válido' })
      }

      // Hacemos un shift para perder el objeto de cabeceras que ya tenemos seteado.
      file.shift()

      // Lo insertamos de forma masiva en la base de datos.
      Student.collection.insertMany(file)

      res.redirect('/classroom/' + aula)
    } else {
      // Si se trata de un fichero xlsx
      // Seteamos las opciones
      const options = {
        delimiter: /[,|;]+/,
        headers: 'name,surname,email,idGithub,orgName'
      }
      // Convertimos de xlsx a csv
      let csv = xlsx('../../public/files/' + req.file.filename)
      // Lo convertimos de csv a JSON
      let file = csvjson.toObject(csv, options)

      // Hacemos un shift para perder el objeto de cabeceras que ya tenemos seteado.
      file.shift()

      // Lo insertamos de forma masiva en la base de datos.
      Student.collection.insertMany(file)

      res.redirect('/classroom/' + aula)
    }
  })
}

/**
* Funcion: load(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Renderiza la vista de subida de fichero
*/
function load (req, res) {
  let aula = req.params.idclass
  res.render('classroom/upload', { titulo: 'Suba el fichero', usuario: req.user, classroom: aula })
}

/**
* Funcion: students(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Muestra la información de los alumnos
*/
async function students (req, res) {
  let aula = req.params.idclass

  try {
    // Consultamos los alumnos del aula
    let alumnos = await Student.find({ 'orgName': aula })
    res.render('classroom/students', { titulo: 'Alumnos', usuario: req.user, classroom: aula, students: alumnos })
  } catch (error) {
    console.log(error)
  }
}

export {
  classrooms,
  classroom,
  orgs,
  orgsP,
  invi,
  inviP,
  options,
  optionsP,
  file,
  load,
  students
}
