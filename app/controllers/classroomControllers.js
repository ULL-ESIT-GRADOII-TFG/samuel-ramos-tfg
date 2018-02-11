// const User = require('../models/user')
// const github = require('../helpers/githubHelper')

function classrooms (req, res) {
  res.render('classroom/classrooms', { titulo: 'Aulas', usuario: req.user })
}

function orgs (req, res) {
  res.render('classroom/classrooms', { titulo: 'Aulas', usuario: req.user })
}

module.exports = {
  classrooms,
  orgs
}
