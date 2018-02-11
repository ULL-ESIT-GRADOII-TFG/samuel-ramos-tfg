const User = require('../models/user')
const Github = require('../helpers/githubHelper').Gh

function classrooms (req, res) {
  res.render('classroom/classrooms', { titulo: 'Organizaciones', usuario: req.user })
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

function orgsP (req, res) {
  console.log(req.body)
}

module.exports = {
  classrooms,
  orgs,
  orgsP
}
