const Github = require('../helpers/githubHelper').Gh
const User = require('../models/user')
const Org = require('../models/org')
const Assign = require('../models/assign')

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

function invi (req, res) {
  let idOrg = req.params.idclass
  let titulo = 'Invitacion para ' + idOrg

  res.render('classroom/invitation', { titulo: titulo, usuario: req.user, classroom: idOrg })
}

function inviP (req, res) {
  let org = req.params.idclass
  let titulo = 'Aula: ' + org

  Org.findOne({ 'login': org }, (err, org) => {
    if (err) console.log(err)

    User.findOne({ 'login': org.ownerLogin }, (err, user) => {
      if (err) console.log(err)

      const ghUser = new Github(user.token)

      ghUser.addUserOrg(org.login, req.user.username)
    .then(result => {
      res.render('classroom/classroom', { titulo: titulo, usuario: req.user })
    })
    })
  })
}

module.exports = {
  classrooms,
  orgs,
  orgsP,
  invi,
  classroom,
  inviP
}
