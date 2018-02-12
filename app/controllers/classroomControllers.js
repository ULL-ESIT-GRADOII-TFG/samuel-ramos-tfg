const Github = require('../helpers/githubHelper').Gh
const User = require('../models/user')
const Org = require('../models/org')

function classrooms (req, res) {
  res.render('classroom/classrooms', { titulo: 'Organizaciones', usuario: req.user })
}

//Controlador para mostras las organizaciones a las que pertenece el usuario.
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

//Controlador para añadir las organizaciones como aulas.
function orgsP (req, res) {
  let data = req.body.data.split(' ')
  let idOrg = data[0]
  let loginOrg = data[1]

  let newOrg = new Org({
    login: loginOrg,
    id: idOrg,
    ownerId: req.user.id,
    ownerLogin: req.user.username,
  })

  newOrg.save((err) => {
    if (err) console.log(err)

    res.redirect('/classroom')
  })
}

module.exports = {
  classrooms,
  orgs,
  orgsP
}
