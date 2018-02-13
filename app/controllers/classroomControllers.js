const Github = require('../helpers/githubHelper').Gh
const User = require('../models/user')
const Org = require('../models/org')

function classrooms (req, res) {
  Org.find({ 'ownerLogin': req.user.username }, (err, org) => {
    if (err) console.log(err)

    res.render('classroom/classrooms', { titulo: 'Organizaciones', usuario: req.user, aulas: org })
  })
}

// Controlador para mostras las organizaciones a las que pertenece el usuario.
function orgs (req, res) {
  User.findOne({ 'login': req.user.username }, (err, user) => {
    if (err) console.log(err)

    const ghUser = new Github(user.token)

    ghUser.userOrgs()
    .then(result => {
      res.render('classroom/orgs', { titulo: 'Organizaciones', usuario: req.user, orgs: result.data })
    })
  })
}

// Controlador para añadir las organizaciones como aulas.
function orgsP (req, res, next) {
  let data = req.body.data.split('@')
  let idOrg = data[0]
  let loginOrg = data[1]
  let avatarUrl = data[2]
  let url = data[3]

  let newOrg = new Org({
    login: loginOrg,
    id: idOrg,
    avatarUrl: avatarUrl,
    ownerId: req.user.id,
    ownerLogin: req.user.username
  })

  newOrg.save((err) => {
    if (err) console.log(err)

    res.redirect('/classrooms')
    next()
  })
}

module.exports = {
  classrooms,
  orgs,
  orgsP
}
