const Github = require('../helpers/githubHelper').Gh
const User = require('../models/user')
const Org = require('../models/org')
const Assign = require('../models/assign')
const Repo = require('../models/repo')

function newAssign (req, res) {
  let orgLogin = req.params.idclass

  Org.findOne({ 'login': orgLogin }, (err, org) => {
    if (err) console.log(err)

    if (org.ownerLogin === req.user.username) {
      res.render('assignments/new', { titulo: 'Nueva tarea', usuario: req.user, classroom: orgLogin })
    } else {
      res.redirect('/classrooms')
    }
  })
}

function newAssignP (req, res) {
  let orgLogin = req.params.idclass
  Org.findOne({ 'login': orgLogin }, (err, org) => {
    if (err) console.log(err)

    if (org.ownerLogin === req.user.username) {
      let newAssign = new Assign({
        titulo: req.body.titulo,
        ownerLogin: req.user.username,
        assignType: 'person',
        repoType: req.body.repo,
        userAdmin: req.body.admin,
        orgLogin: orgLogin
      })

      newAssign.save((err) => {
        if (err) console.log(err)

        res.redirect('/classroom/' + orgLogin)
      })
    } else {
      res.redirect('/classrooms')
    }
  })
}

function assign (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let titulo = 'Tarea ' + req.params.idassign

  Org.findOne({ 'login': aula }, (err, org) => {
    if (err) console.log(err)

    if (org.ownerLogin === req.user.username) {
      res.render('assignments/assign', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula })
    } else {
      res.redirect('/classrooms')
    }
  })
}

function assignInvi (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  console.log(tarea)
  let titulo = 'Tarea ' + req.params.idassign

  res.render('assignments/invitation', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula })
}

function assignInviP (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let repo = tarea + '-' + req.user.username
  let estudiante = req.user.username

  Org.findOne({ 'login': aula }, (err, org) => {
    if (err) console.log(err)

    User.findOne({ 'login': org.ownerLogin }, (err, user) => {
      if (err) console.log(err)

      let newRepo = new Repo({
        name: repo,
        assignName: tarea,
        StudentLogin: estudiante,
        ownerLogin: user.login,
        orgLogin: aula
      })

      newRepo.save((err) => {
        if (err) console.log(err)
      })

      const ghUser = new Github(user.token)

      ghUser.createRepo(aula, repo, 'Repo created by CodeLab', false, req.user.id)
      .then(result => {
        console.log(result)

        ghUser.addCollaborator(aula, repo, estudiante)
        .then(result => {
          console.log(result)
        })
      })
    })
  })
}

module.exports = {
  newAssign,
  newAssignP,
  assign,
  assignInvi,
  assignInviP
}
