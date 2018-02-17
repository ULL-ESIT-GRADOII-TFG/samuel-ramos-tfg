/* const Github = require('../helpers/githubHelper').Gh
const User = require('../models/user')
const Org = require('../models/org')
*/

function newAssign (req, res) {
  let orgLogin = req.params.idclass
  res.render('assignments/new', { titulo: 'Nueva tarea', usuario: req.user, classroom: orgLogin })
}

function newAssignP (req, res) {
  let orgLogin = req.params.idclass
  console.log(req.body)
  res.redirect('/classroom/' + orgLogin)
}

module.exports = {
  newAssign,
  newAssignP
}
