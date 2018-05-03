import Repo from '../models/repo'
import Group from '../models/group'

/**
* Funcion: home(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Renderiza la vista home
*/
function home (req, res) {
  res.render('static_pages/home', { titulo: 'CodeLab', usuario: req.user })
}

/**
* Funcion: logout(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Controla el log out
*/
function logout (req, res) {
  req.logout()
  res.redirect('/')
}

/**
* Funcion: redirectHome(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Redirige a home
*/
function redirectHome (req, res) {
  res.redirect('/')
}

/**
* Funcion: profiles(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Renderiza el perfil
*/
async function profiles (req, res) {
  try {
    // Hacemos las consultas para saber que tareas ha realizado el alumno.
    let repos = await Repo.find({ 'StudentLogin': req.user.username })
    let groups = await Group.find({ })
    res.render('static_pages/profile', { titulo: 'Perfil', usuario: req.user, tareas: repos, tareasGrupales: groups })
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: err(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Renderiza la vista de error
*/
function err (req, res) {
  res.render('static_pages/error', { titulo: 'Error: Página no encontrada', usuario: req.user })
}

/**
* Funcion: help(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Renderiza la vista de help
*/
function help (req, res) {
  res.render('static_pages/help', { titulo: 'Ayuda', usuario: req.user })
}

export {
  home,
  logout,
  redirectHome,
  profiles,
  err,
  help
}
