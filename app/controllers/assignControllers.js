import User from '../models/user'
import Org from '../models/org'
import Assign from '../models/assign'
import Repo from '../models/repo'
import Group from '../models/group'
import Team from '../models/team'
import Student from '../models/student'

import Github from '../helpers/githubHelper'

import * as Eval from '../helpers/evaluationHelper'

const nameFormat = new RegExp('[^a-zA-Z0-9_.-]+', 'g')

// Controller for get the new assign page.
async function newAssign (req, res) {
  let orgLogin = req.params.idclass

  try {
    let org = await Org.findOne({ 'login': orgLogin })

    if (org.ownerLogin === req.user.username) {
      res.render('assignments/new', { titulo: 'Nueva tarea', usuario: req.user, classroom: orgLogin })
    } else {
      res.redirect('/classrooms')
    }
  } catch (error) {
    console.log(error)
  }
}

// Controller for create the new assign in the db.
async function newAssignP (req, res) {
  let orgLogin = req.params.idclass
  let titleFormated = req.body.titulo.replace(nameFormat, '-')
  let repoType
  let permisos
  console.log(req.body.admin)

  try {
    let org = await Org.findOne({ 'login': orgLogin })

    if (req.body.admin === 'true') {
      permisos = 'admin'
    } else {
      permisos = 'push'
    }

    if (req.body.repo === 'true') {
      repoType = true
    } else {
      repoType = false
    }

    if (org.ownerLogin === req.user.username) {
      let newAssign = new Assign({
        title: titleFormated,
        ownerLogin: req.user.username,
        assignType: req.body.type,
        userAdmin: permisos,
        repoType: repoType,
        orgLogin: orgLogin,
        isActive: true
      })

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

// Controller for get the assign page.
async function assign (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let titulo = 'Tarea ' + req.params.idassign

  try {
    let org = await Org.findOne({ 'login': aula })
    let repos = await Repo.find({ 'orgLogin': aula, assignName: tarea })
    let alumnos = await Student.find({ 'orgName': aula })

    if (org) {
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

// Controller for get the assign invitation page.
function assignInvi (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let titulo = 'Tarea ' + req.params.idassign

  res.render('assignments/invitation', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula })
}

// Controller for  add a member to the individual assign.
async function assignInviP (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let repo = tarea + '-' + req.user.username
  let estudiante = req.user.username

  try {
    let assign = await Assign.findOne({ 'orgLogin': aula })
    let user = await User.findOne({ 'login': assign.ownerLogin })

    if (!assign.isActive) {
      res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'Ya no puedes aceptar esta tarea, está deshabilitado.' })
    } else {
      let newRepo = new Repo({
        name: repo,
        assignName: tarea,
        StudentLogin: estudiante,
        ownerLogin: user.login,
        orgLogin: aula
      })
      await newRepo.save()

      const ghUser = new Github(user.token)

      console.log(assign.userAdmin)
      await ghUser.createRepo(aula, repo, 'Repo created by CodeLab', assign.repoType)
      await ghUser.addCollaborator(aula, repo, estudiante, assign.userAdmin)

      res.redirect('https://github.com/' + aula + '/' + repo)
    }
  } catch (error) {
    console.log(error)
    res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'Error al aceptar la tarea' })
  }
}

// Controller for get the group invi page.
async function groupInvi (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let titulo = 'Tarea ' + req.params.idassign
  try {
    let teams = await Team.find({ org: aula })
    res.render('assignments/groupInvi', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula, equipos: teams })
  } catch (error) {
    console.log(error)
  }
}

// Controller for  add a member to the group assign.
async function groupInviP (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign
  let teamName = req.body.team
  let repo = tarea + '-' + teamName

  try {
    let assign = await Assign.findOne({ 'orgLogin': aula })
    let user = await User.findOne({ 'login': assign.ownerLogin })
    let team = await Team.findOne({ 'name': teamName })

    if (!assign.isActive) {
      res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'Ya no puedes aceptar esta tarea, está deshabilitado.' })
    } else {
      await Team.update({ name: team.name }, { $push: {members: req.user.username} })

      const ghUser = new Github(user.token)
      await ghUser.addMember(team.id, req.user.username)

      res.redirect('https://github.com/' + aula + '/' + repo)
    }
  } catch (error) {
    res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'El miembro ya forma parte del equipo' })
  }
}

// Controller for get the group assign page.
async function groupAssign (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let titulo = 'Tarea ' + req.params.idassign

  try {
    let org = await Org.findOne({ 'login': aula })
    let repos = await Group.find({ 'orgLogin': aula, assignName: tarea })

    if (org) {
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

// Controller for get the newteams page
function team (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign
  let titulo = 'Nuevo equipo'

  res.render('assignments/newTeam', { titulo: titulo, usuario: req.user, classroom: aula, assign: tarea })
}

// Controller for create a new team and an new group assign
async function teamP (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign
  let teamFormated = req.body.team.replace(nameFormat, '-')
  let repo = tarea + '-' + teamFormated
  let idTeam
  try {
    let assign = await Assign.findOne({ 'orgLogin': aula })
    let user = await User.findOne({ 'login': assign.ownerLogin })

    if (!assign.isActive) {
      res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'Ya no puedes aceptar esta tarea, está deshabilitado.' })
    } else {
      const ghUser = new Github(user.token)

      let result = await ghUser.createTeam(aula, teamFormated, [req.user.username])

      let newTeam = new Team({
        name: teamFormated,
        id: result.data.id,
        members: [req.user.username],
        org: aula
      })

      await newTeam.save()

      idTeam = result.data.id
      let newGroup = new Group({
        name: repo,
        assignName: tarea,
        team: teamFormated,
        idTeam: idTeam,
        ownerLogin: user.login,
        orgLogin: aula
      })

      await newGroup.save()

      await ghUser.createRepo(aula, repo, 'Repo created by CodeLab', assign.assignType)
      await ghUser.addTeam(idTeam, aula, repo)
      res.redirect('https://github.com/' + aula + '/' + repo)
    }
  } catch (error) {
    res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'El equipo ya existe' })
  }
}

// Controller for get the assign options
async function optionsG (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign

  try {
    let org = await Org.findOne({ 'login': aula })
    let assign = await Assign.findOne({ 'orgLogin': aula, 'title': tarea })

    if (org.ownerLogin === req.user.username) {
      res.render('assignments/options', { titulo: 'Opciones', usuario: req.user, classroom: aula, assign: tarea, activado: assign.isActive })
    } else {
      res.redirect('/classrooms')
    }
  } catch (error) {
    console.log(error)
  }
}

// Controller for save the options page
async function optionsP (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign

  if (req.body.activador) {
    await Assign.findOneAndUpdate({ titulo: tarea }, { isActive: true })
  } else {
    await Assign.findOneAndUpdate({ titulo: tarea }, { isActive: false })
  }
  res.redirect('/assign/' + aula + '/' + tarea)
}

async function evalRepo (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign
  let evalRepo = 'eval-' + tarea
  let readme = '# Eval repo\n' + 'Clone and exec ```./eval.sh``` for get all the students repos'

  try {
    let result = await Eval.createSubmodule(aula, tarea, req.user.username)
    let usr = await User.findOne({ 'login': req.user.username })

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
