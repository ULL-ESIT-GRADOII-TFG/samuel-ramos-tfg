import User from '../models/user'
import Org from '../models/org'
import Assign from '../models/assign'
import Repo from '../models/repo'
import Group from '../models/group'
import Team from '../models/team'
import Student from '../models/student'

import Github from '../helpers/githubHelper'

import * as Eval from '../helpers/evaluationHelper'

// Expresión regular para el formato del nombre
const nameFormat = new RegExp('[^a-zA-Z0-9_.-]+', 'g')

/**
* Funcion: newAssign(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Renderiza la vista de nueva asignación
*/
async function newAssign (req, res) {
  let orgLogin = req.params.idclass

  try {
    // Solicitamos la organización
    let org = await Org.findOne({ 'login': orgLogin })

    // Comprobamos que el dueño de la organización es el usuario activo.
    if (org.ownerLogin === req.user.username) {
      // Si el dueño es el usuario activo le renderizamos la vista
      res.render('assignments/new', { titulo: 'Nueva tarea', usuario: req.user, classroom: orgLogin })
    } else {
      // En caso contrario lo redirigimos a Home
      res.redirect('/classrooms')
    }
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: newAssignP(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Crea la tarea en la base de datos
*/
async function newAssignP (req, res) {
  let orgLogin = req.params.idclass
  let titleFormated = req.body.titulo.replace(nameFormat, '-')
  let repoType
  let permisos
  console.log(req.body.admin)

  try {
    // Hacemos una consulta de la organización
    let org = await Org.findOne({ 'login': orgLogin })

    // Seteamos los permisos del usuario (admin o push)
    if (req.body.admin === 'true') {
      permisos = 'admin'
    } else {
      permisos = 'push'
    }

    // Seteamos el tipo de repositorio (privado o público)
    if (req.body.repo === 'true') {
      repoType = true
    } else {
      repoType = false
    }

    // Comprobamos que el dueño de la organización es el usuario activo.
    if (org.ownerLogin === req.user.username) {
      // Creamos el objeto para insertarlo en Mongo
      let newAssign = new Assign({
        title: titleFormated,
        ownerLogin: req.user.username,
        assignType: req.body.type,
        userAdmin: permisos,
        repoType: repoType,
        orgLogin: orgLogin,
        isActive: true
      })

      // Guardamos el objeto en la base de datos
      await newAssign.save()

      res.redirect('/classroom/' + orgLogin)
    } else {
      res.redirect('/classrooms')
    }
  } catch (error) {
    console.log(error)
    res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'La tarea ya existe' })
  }
}

/**
* Funcion: assign(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Reneriza la vista de la asignación
*/
async function assign (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let titulo = 'Tarea ' + req.params.idassign

  try {
    // Realizamos la consulta del aula.
    let org = await Org.findOne({ 'login': aula })
    // Realizamos la consulta de las tareas del aula.
    let repos = await Repo.find({ 'orgLogin': aula, assignName: tarea })
    // Consultamos los alumnos para mostrar su información asociada
    let alumnos = await Student.find({ 'orgName': aula })

    // Comprobamos que la asignación existe en la organización.
    if (org) {
      // Comprobamos que el usuario activo es el dueño
      if (org.ownerLogin === req.user.username) {
        res.render('assignments/assign', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula, assigns: repos, students: alumnos })
      } else {
        res.redirect('/classrooms')
      }
    } else {
      res.render('assignments/assign', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula })
    }
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: assignInvi(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Reneriza la vista de la invitación a la asignación
*/
function assignInvi (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let titulo = 'Tarea ' + req.params.idassign

  res.render('assignments/invitation', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula })
}

/**
* Funcion: assignInviP(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Crea el repositorio y añade el repo a la base de datos
*/
async function assignInviP (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let repo = tarea + '-' + req.user.username
  let estudiante = req.user.username

  try {
    // Se hacen la consulta de la asignación
    let assign = await Assign.findOne({ 'orgLogin': aula })
    // Se buscan los datos del usuario que acepta
    let user = await User.findOne({ 'login': assign.ownerLogin })

    // Se comprueba que la asignación está activa
    if (!assign.isActive) {
      res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'Ya no puedes aceptar esta tarea, está deshabilitado.' })
    } else {
      // Se crea el objeto del repositorio
      let newRepo = new Repo({
        name: repo,
        assignName: tarea,
        StudentLogin: estudiante,
        ownerLogin: user.login,
        orgLogin: aula
      })

      // Se guarda el objeto en base de datos
      await newRepo.save()

      // Se inicializa la github API
      const ghUser = new Github(user.token)

      // Se crea el repositorio
      await ghUser.createRepo(aula, repo, 'Repo created by CodeLab', assign.repoType)
      // Se añade al usuario como colaborador
      await ghUser.addCollaborator(aula, repo, estudiante, assign.userAdmin)

      res.redirect('https://github.com/' + aula + '/' + repo)
    }
  } catch (error) {
    console.log(error)
    res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'Error al aceptar la tarea' })
  }
}

/**
* Funcion: groupInvi(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Reneriza la vista de la invitacion a la asignación grupal
*/
async function groupInvi (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let titulo = 'Tarea ' + req.params.idassign
  try {
    // Se buscan los equipos del aula
    let teams = await Team.find({ org: aula })
    res.render('assignments/groupInvi', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula, equipos: teams })
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: groupInviP(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Gestiona la creación de equipos y tareas grupales
*/
async function groupInviP (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign
  let teamName = req.body.team
  let repo = tarea + '-' + teamName

  try {
    // Se leen los datos del aula
    let assign = await Assign.findOne({ 'orgLogin': aula })
    // Se leen los datos del usuario
    let user = await User.findOne({ 'login': assign.ownerLogin })
    // Se leen los datos del equipo
    let team = await Team.findOne({ 'name': teamName })

    // Se comprueba si la asignación está activa
    if (!assign.isActive) {
      res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'Ya no puedes aceptar esta tarea, está deshabilitado.' })
    } else {
      // Se actuliza el equipo con el miembro nuevo
      await Team.update({ name: team.name }, { $push: {members: req.user.username} })

      // Se inicializa la Github API
      const ghUser = new Github(user.token)
      // Se añade el miembro al equipo  en github
      await ghUser.addMember(team.id, req.user.username)

      res.redirect('https://github.com/' + aula + '/' + repo)
    }
  } catch (error) {
    res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'El miembro ya forma parte del equipo' })
  }
}

/**
* Funcion: groupAddign(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Renderiza la vista de la asignación grupal
*/
async function groupAssign (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let titulo = 'Tarea ' + req.params.idassign

  try {
    // Consulta de los datos de la organización
    let org = await Org.findOne({ 'login': aula })
    // Consulta de las asignaciones grupales
    let repos = await Group.find({ 'orgLogin': aula, assignName: tarea })

    // Se comprueba si la tarea existe en ese organización
    if (org) {
      // Se comprueba si el usuario activo es el dueño
      if (org.ownerLogin === req.user.username) {
        res.render('assignments/groupAssign', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula, assigns: repos })
      } else {
        res.redirect('/classrooms')
      }
    } else {
      res.render('assignments/groupAssign', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula })
    }
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: team(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Renderiza la vista de creación de equipo
*/
function team (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign
  let titulo = 'Nuevo equipo'

  res.render('assignments/newTeam', { titulo: titulo, usuario: req.user, classroom: aula, assign: tarea })
}

/**
* Funcion: teamP(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Crea un equipo nuevo
*/
async function teamP (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign
  let teamFormated = req.body.team.replace(nameFormat, '-')
  let repo = tarea + '-' + teamFormated
  let idTeam
  try {
    // Se consulta la información de la asignación
    let assign = await Assign.findOne({ 'orgLogin': aula })
    // Se consulta la información del alumno
    let user = await User.findOne({ 'login': assign.ownerLogin })

    // Se comprueba si la aginación está activa
    if (!assign.isActive) {
      res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'Ya no puedes aceptar esta tarea, está deshabilitado.' })
    } else {
      // Se inicializa la Github API
      const ghUser = new Github(user.token)

      // Se crea el equipo en github
      let result = await ghUser.createTeam(aula, teamFormated, [req.user.username])

      // Se crea el equipo
      let newTeam = new Team({
        name: teamFormated,
        id: result.data.id,
        members: [req.user.username],
        org: aula
      })

      // Se guarda el equipo en la base de datos
      await newTeam.save()

      idTeam = result.data.id

      // Se crea el repositio grupal
      let newGroup = new Group({
        name: repo,
        assignName: tarea,
        team: teamFormated,
        idTeam: idTeam,
        ownerLogin: user.login,
        orgLogin: aula
      })

      // Se guarda el repositorio en la base de datos
      await newGroup.save()

      // Se crea el equipo en la organización
      await ghUser.createRepo(aula, repo, 'Repo created by CodeLab', assign.assignType)
      // Se añade el equipo al repositorio
      await ghUser.addTeam(idTeam, aula, repo)
      res.redirect('https://github.com/' + aula + '/' + repo)
    }
  } catch (error) {
    res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'El equipo ya existe' })
  }
}

/**
* Funcion: optionsG(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Reneriza la vista de la asignación
*/
async function optionsG (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign

  try {
    // Se consulta la información del aula
    let org = await Org.findOne({ 'login': aula })
    // Se consulta la información de la organizacion
    let assign = await Assign.findOne({ 'orgLogin': aula, 'title': tarea })

    // Se comprueba si el usuario activo es el dueño
    if (org.ownerLogin === req.user.username) {
      res.render('assignments/options', { titulo: 'Opciones', usuario: req.user, classroom: aula, assign: tarea, activado: assign.isActive })
    } else {
      res.redirect('/classrooms')
    }
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: optionsP(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Reneriza la vista de las opciones
*/
async function optionsP (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign

  try {
    // Comprobamos si la asignación está activa o inactiva.
    if (req.body.activador) {
      await Assign.findOneAndUpdate({ titulo: tarea }, { isActive: true })
    } else {
      await Assign.findOneAndUpdate({ titulo: tarea }, { isActive: false })
    }
    res.redirect('/assign/' + aula + '/' + tarea)
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: evalRepo(req, res)
*
* Parámetros: req: request, res: response
*
* Descripción: Crea el repositorio de evaluación
*/
async function evalRepo (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign
  let evalRepo = 'eval-' + tarea
  let readme = '# Eval repo\n' + 'Clone and exec ```./eval.sh``` for get all the students repos'

  try {
    // Hacemos la llamada al create submodule
    let result = await Eval.createSubmodule(aula, tarea, req.user.username)
    // Buscamos los datos del usuario
    let usr = await User.findOne({ 'login': req.user.username })

    // Creamos el repositorio de evaluación
    await Eval.createEvalRepo(aula, evalRepo, usr, result, readme, res)
    res.redirect('/assign/' + tarea + '/' + tarea)
  } catch (error) {
    console.log(error)
  }
}

export {
  newAssign,
  newAssignP,
  assign,
  assignInvi,
  assignInviP,
  groupInvi,
  groupAssign,
  groupInviP,
  team,
  teamP,
  optionsG,
  optionsP,
  evalRepo
}
