const Github = require('../helpers/githubHelper').Gh
const User = require('../models/user')
const Org = require('../models/org')

function classrooms (req, res) {
  Org.find({ 'ownerLogin': req.user.username }, (err, org) => {
    if (err) console.log(err)

    res.render('classroom/classrooms', { titulo: 'Aulas', usuario: req.user, aulas: org })
  })
}

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
    ownerLogin: req.user.username
  })

  newOrg.save((err) => {
    if (err) console.log(err)

    res.redirect('/classrooms')
    next()
  })
}

function classroom (req, res) {
  let titulo = 'Aula'
  let idOrg = req.params.idclass
  console.log(idOrg)

  res.render('classroom/classroom', { titulo: titulo, usuario: req.user })
}

function invi (req, res) {
  let titulo = 'Invitacion para '
  let idOrg = req.params.idClass
  console.log(idOrg)

  res.render('classroom/invitation', { titulo: titulo, usuario: req.user })
}

module.exports = {
  classrooms,
  orgs,
  orgsP,
  invi,
  classroom
}
