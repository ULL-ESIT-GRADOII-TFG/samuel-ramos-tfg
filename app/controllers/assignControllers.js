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
  let titulo = 'Tarea ' + req.params.idassign

  res.render('assignments/assign', { titulo: titulo, usuario: req.user, assign: tarea })
}

module.exports = {
  newAssign,
  newAssignP,
  assign
}
