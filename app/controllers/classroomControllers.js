const multer = require('multer')
const path = require('path')

const Github = require('../helpers/githubHelper').Gh
const User = require('../models/user')
const Org = require('../models/org')
const Assign = require('../models/assign')

// Multer config
const storage = multer.diskStorage({
  destination: './public/files/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage }).single('csv')

// Controller for get classrom page.
function classrooms (req, res) {
  Org.find({ 'ownerLogin': req.user.username }, (err, org) => {
    if (err) console.log(err)

    res.render('classroom/classrooms', { titulo: 'Aulas', usuario: req.user, aulas: org })
  })
}

// Controller for get orgs page.
function orgs (req, res) {
  User.findOne({ 'login': req.user.username }, (err, user) => {
    if (err) console.log(err)

    const ghUser = new Github(user.token)

    ghUser.userOrgs()
    .then(result => {
      res.render('classroom/orgs', { titulo: 'Organizaciones', usuario: req.user, orgs: result.data })
    })
    .catch(error => {
      console.log(error)
    })
  })
}

// Controller for create a new classroom.
function orgsP (req, res, next) {
  let data = req.body.data.split('@')
  let idOrg = data[0]
  let loginOrg = data[1]
  let avatarUrl = data[2]

  let newOrg = new Org({
    login: loginOrg,
    id: idOrg,
    avatarUrl: avatarUrl,
    ownerId: req.user.id,
    ownerLogin: req.user.username,
    isActive: true
  })

  newOrg.save((err) => {
    if (err) console.log(err)

    res.redirect('/classrooms')
    next()
  })
}

// Controller for get classrom page.
function classroom (req, res) {
  let idOrg = req.params.idclass
  let titulo = 'Aula: ' + idOrg

  Org.findOne({ 'login': idOrg }, (err, org) => {
    if (err) console.log(err)

    if (org.ownerLogin === req.user.username) {
      Assign.find({ 'orgLogin': idOrg }, (err, assigns) => {
        if (err) console.log(err)

        res.render('classroom/classroom', { titulo: titulo, usuario: req.user, classroom: idOrg, assign: assigns })
      })
    } else {
      res.redirect('/classrooms')
    }
  })
}

// Controller for get invi page.
function invi (req, res) {
  let idOrg = req.params.idclass
  let titulo = 'Invitacion para ' + idOrg

  res.render('classroom/invitation', { titulo: titulo, usuario: req.user, classroom: idOrg })
}

// Controller for add a member to the classroom.
function inviP (req, res) {
  let org = req.params.idclass
  let titulo = 'Aula: ' + org

  Org.findOne({ 'login': org }, (err, org) => {
    if (err) console.log(err)

    if (!org.isActive) {
      return res.render('static_pages/error2', { titulo: 'Error', usuario: req.user, msg: 'Ya no puedes aceptar esta tarea, está deshabilitado.' })
    } else {
      User.findOne({ 'login': org.ownerLogin }, (err, user) => {
        if (err) console.log(err)

        const ghUser = new Github(user.token)

        ghUser.addUserOrg(org.login, req.user.username)
        .then(result => {
          res.render('classroom/classroom', { titulo: titulo, usuario: req.user })
        })
        .catch(error => {
          console.log(error)
        })
      })
    }
  })
}

// Controller for get options page.
function options (req, res) {
  let aula = req.params.idclass

  Org.findOne({ 'login': aula }, (err, org) => {
    if (err) console.log(err)

    if (org.ownerLogin === req.user.username) {
      res.render('classroom/options', { titulo: 'Opciones', usuario: req.user, classroom: aula, activado: org.isActive })
    } else {
      res.redirect('/classrooms')
    }
  })
}

// Controller for save options.
function optionsP (req, res) {
  let aula = req.params.idclass

  console.log(req.body)

  if (req.body.activador) {
    Org.findOneAndUpdate({ login: aula }, { isActive: true }, (err) => {
      if (err) console.log(err)
    })
  } else {
    Org.findOneAndUpdate({ login: aula }, { isActive: false }, (err) => {
      if (err) console.log(err)
    })
  }
  res.redirect('/classroom/' + aula)
}

function file (req, res) {
  upload(req, res, err => {
    if (err) console.log(err)

    console.log(req.file)
    console.log('test')
  })
}

function load (req, res) {
  let aula = req.params.idclass
  res.render('classroom/upload', { titulo: 'Suba el fichero', usuario: req.user, classroom: aula })
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
  load
}
