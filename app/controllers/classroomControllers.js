const multer = require('multer')
const csvjson = require('csvjson')
const path = require('path')
const fs = require('fs')

const Github = require('../helpers/githubHelper').Gh
const xlsx = require('../helpers/xlsxConvert')
const User = require('../models/user')
const Org = require('../models/org')
const Assign = require('../models/assign')
const Student = require('../models/student')

// Multer config
const storage = multer.diskStorage({
  destination: './public/files/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
}).single('csv')

function checkFileType (file, cb) {
  const fileTypes = /csv|xlsx/
  const mimeTypes = /csv|spreadsheetml/

  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = mimeTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    return cb(new Error('Solo CSV'))
  }
}

// Controller for get classrom page.
async function classrooms (req, res) {
  try {
    let org = await Org.find({ 'ownerLogin': req.user.username })
    res.render('classroom/classrooms', { titulo: 'Aulas', usuario: req.user, aulas: org })
  } catch (error) {
    console.log(error)
  }
}

// Controller for get orgs page.
async function orgs (req, res) {
  try {
    let user = await User.findOne({ 'login': req.user.username })
    const ghUser = new Github(user.token)
    let result = await ghUser.userOrgs()

    res.render('classroom/orgs', { titulo: 'Organizaciones', usuario: req.user, orgs: result.data })
  } catch (error) {
    console.log(error)
  }
}

// Controller for create a new classroom.
async function orgsP (req, res, next) {
  let data = req.body.data.split('@')
  let idOrg = data[0]
  let loginOrg = data[1]
  let avatarUrl = data[2]

  try {
    let newOrg = new Org({
      login: loginOrg,
      id: idOrg,
      avatarUrl: avatarUrl,
      ownerId: req.user.id,
      ownerLogin: req.user.username,
      isActive: true
    })

    await newOrg.save()
    res.redirect('/classrooms')
  } catch (error) {
    console.log(error)
  }
}

// Controller for get classrom page.
async function classroom (req, res) {
  let idOrg = req.params.idclass
  let titulo = 'Aula: ' + idOrg

  let org = await Org.findOne({ 'login': idOrg })
  let assigns = await Assign.find({ 'orgLogin': idOrg })

  if (org.ownerLogin === req.user.username) {
    res.render('classroom/classroom', { titulo: titulo, usuario: req.user, classroom: idOrg, assign: assigns })
  } else {
    res.redirect('/classrooms')
  }
}

// Controller for get invi page.
function invi (req, res) {
  let idOrg = req.params.idclass
  let titulo = 'Invitacion para ' + idOrg

  res.render('classroom/invitation', { titulo: titulo, usuario: req.user, classroom: idOrg })
}

// Controller for add a member to the classroom.
async function inviP (req, res) {
  let org = req.params.idclass
  let titulo = 'Aula: ' + org

  let orgs = await Org.findOne({ 'login': org })
  let user = await User.findOne({ 'login': org.ownerLogin })

  if (!org.isActive) {
    return res.render('static_pages/error2', { titulo: 'Error', usuario: req.user, msg: 'Ya no puedes aceptar esta tarea, está deshabilitado.' })
  } else {
    const ghUser = new Github(user.token)

    await ghUser.addUserOrg(orgs.login, req.user.username)
    res.render('classroom/classroom', { titulo: titulo, usuario: req.user })
  }
}

// Controller for get options page.
async function options (req, res) {
  let aula = req.params.idclass
  let org = await Org.findOne({ 'login': aula })

  if (org.ownerLogin === req.user.username) {
    res.render('classroom/options', { titulo: 'Opciones', usuario: req.user, classroom: aula, activado: org.isActive })
  } else {
    res.redirect('/classrooms')
  }
}

// Controller for save options.
async function optionsP (req, res) {
  let aula = req.params.idclass

  if (req.body.activador) {
    await Org.findOneAndUpdate({ login: aula }, { isActive: true })
  } else {
    await Org.findOneAndUpdate({ login: aula }, { isActive: false })
  }
  res.redirect('/classroom/' + aula)
}

function file (req, res) {
  let aula = req.params.idclass

  upload(async (req, res, err) => {
    if (err) return res.render('static_pages/error2', { titulo: 'Error', usuario: req.user, msg: 'Sólo se pueden ficheros con formato csv' })

    console.log(path.extname(req.file.filename))
    if (path.extname(req.file.filename) === '.csv') {
      const options = {
        delimiter: /[,|;]+/,
        headers: 'name,surname,email,idGithub,orgName'
      }
      let file
      try {
        let data = fs.readFileSync(path.join(__dirname, '../../public/files/' + req.file.filename), { encoding: 'utf8' })
        file = csvjson.toObject(data, options)
      } catch (error) {
        return res.render('static_pages/error2', { titulo: 'Error', usuario: req.user, msg: 'Sube un fichero válido' })
      }

      file.shift()

      await Student.collection.insertMany(file)

      res.redirect('/classroom/' + aula)
    } else {
      const options = {
        delimiter: /[,|;]+/,
        headers: 'name,surname,email,idGithub,orgName'
      }
      let csv = xlsx('../../public/files/' + req.file.filename)
      let file = csvjson.toObject(csv, options)

      file.shift()

      await Student.collection.insertMany(file)
      res.redirect('/classroom/' + aula)
    }
  })
}

function load (req, res) {
  let aula = req.params.idclass
  res.render('classroom/upload', { titulo: 'Suba el fichero', usuario: req.user, classroom: aula })
}

async function students (req, res) {
  let aula = req.params.idclass

  let alumnos = await Student.find({ 'orgName': aula })
  res.render('classroom/students', { titulo: 'Alumnos', usuario: req.user, classroom: aula, students: alumnos })
}

module.exports = {
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
