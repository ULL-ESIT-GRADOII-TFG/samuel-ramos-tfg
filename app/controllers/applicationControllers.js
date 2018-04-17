import Repo from '../models/repo'
import Group from '../models/group'

// Controller for get home page.
function home (req, res) {
  res.render('static_pages/home', { titulo: 'Home', usuario: req.user })
}

// Controller for logout.
function logout (req, res) {
  req.logout()
  res.redirect('/')
}

// Controller for redirect home page.
function redirectHome (req, res) {
  res.redirect('/')
}

// Controller for get profile page.
async function profiles (req, res) {
  try {
    let repos = await Repo.find({ 'StudentLogin': req.user.username })
    let groups = await Group.find({ })
    res.render('static_pages/profile', { titulo: 'Profile', usuario: req.user, tareas: repos, tareasGrupales: groups })
  } catch (error) {
    console.log(error)
  }
}

// Controller for get error page.
function err (req, res) {
  res.render('static_pages/error', { titulo: 'Error: Página no encontrada', usuario: req.user })
}

function help (req, res) {
  res.render('static_pages/help', { titulo: 'Ayuda', usuario: req.user })
}

module.exports = {
  home,
  logout,
  redirectHome,
  profiles,
  err,
  help
}
