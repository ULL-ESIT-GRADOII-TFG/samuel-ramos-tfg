const Repo = require('../models/repo')
const Group = require('../models/group')
const teamHelper = require('../helpers/teamHelper')

function home (req, res) {
  res.render('static_pages/home', { titulo: 'Home', usuario: req.user })
}

function logout (req, res) {
  req.logout()
  res.redirect('/')
}

function redirectHome (req, res) {
  res.redirect('/')
}

function profiles (req, res) {
  Repo.find({ 'StudentLogin': req.user.username }, (err, repos) => {
    if (err) console.log(err)

    Group.find({ }, (err, groups) => {
      if (err) console.log(err)

      let userTeamRepos = teamHelper(groups, req.user.username)
      console.log(userTeamRepos)
      console.log(repos)
      res.render('static_pages/profile', { titulo: 'Profile', usuario: req.user, tareas: repos, tareasGrupales: userTeamRepos })
    })
  })
}

function err (req, res) {
  res.render('static_pages/error', { titulo: 'Error: Página no encontrada', usuario: req.user })
}

module.exports = {
  home,
  logout,
  redirectHome,
  profiles,
  err
}
