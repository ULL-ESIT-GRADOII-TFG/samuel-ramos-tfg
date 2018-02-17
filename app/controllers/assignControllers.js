const Assign = require('../models/assign')

function newAssign (req, res) {
  let orgLogin = req.params.idclass
  res.render('assignments/new', { titulo: 'Nueva tarea', usuario: req.user, classroom: orgLogin })
}

function newAssignP (req, res) {
  let orgLogin = req.params.idclass
  console.log(req.body)
  let newAssign = new Assign({
    titulo: req.body.titulo,
    ownerLogin: req.user.username,
    repoType: req.body.repo,
    userAdmin: req.body.admin,
    orgLogin: orgLogin
  })

  newAssign.save((err) => {
    if (err) console.log(err)

    res.redirect('/classroom/' + orgLogin)
  })
}

module.exports = {
  newAssign,
  newAssignP
}
