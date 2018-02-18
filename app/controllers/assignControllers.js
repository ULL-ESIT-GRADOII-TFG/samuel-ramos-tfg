const Assign = require('../models/assign')

function newAssign (req, res) {
  let orgLogin = req.params.idclass
  res.render('assignments/new', { titulo: 'Nueva tarea', usuario: req.user, classroom: orgLogin })
}

function newAssignP (req, res) {
  let orgLogin = req.params.idclass
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
}

function assign (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let titulo = 'Tarea ' + req.params.idassign

  res.render('assignments/assign', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula })
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

  console.log(tarea + '-' + req.user.username)
  console.log(aula)
}

module.exports = {
  newAssign,
  newAssignP,
  assign,
  assignInvi,
  assignInviP
}
