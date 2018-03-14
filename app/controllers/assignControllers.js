const base64 = require('base-64')
const utf8 = require('utf8')

const Github = require('../helpers/githubHelper').Gh
const evaluationRepo = require('../helpers/evaluationHelper')

const User = require('../models/user')
const Org = require('../models/org')
const Assign = require('../models/assign')
const Repo = require('../models/repo')
const Group = require('../models/group')
const Team = require('../models/team')

const nameFormat = new RegExp('[^a-zA-Z0-9_.-]+', 'g')

// Controller for get the new assign page.
function newAssign (req, res) {
  let orgLogin = req.params.idclass

  Org.findOne({ 'login': orgLogin }, (err, org) => {
    if (err) console.log(err)

    if (org.ownerLogin === req.user.username) {
      res.render('assignments/new', { titulo: 'Nueva tarea', usuario: req.user, classroom: orgLogin })
    } else {
      res.redirect('/classrooms')
    }
  })
}

// Controller for create the new assign in the db.
function newAssignP (req, res) {
  let orgLogin = req.params.idclass
  let titleFormated = req.body.titulo.replace(nameFormat, '-')
  Org.findOne({ 'login': orgLogin }, (err, org) => {
    if (err) console.log(err)

    if (org.ownerLogin === req.user.username) {
      let newAssign = new Assign({
        title: titleFormated,
        ownerLogin: req.user.username,
        assignType: req.body.type,
        repoType: req.body.repo,
        userAdmin: req.body.admin,
        orgLogin: orgLogin,
        isActive: true
      })

      newAssign.save((err) => {
        if (err) {
          res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'La tarea ya existe' })
        } else {
          res.redirect('/classroom/' + orgLogin)
        }
      })
    } else {
      res.redirect('/classrooms')
    }
  })
}

// Controller for get the assign page.
function assign (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let titulo = 'Tarea ' + req.params.idassign

  Org.findOne({ 'login': aula }, (err, org) => {
    if (err) console.log(err)

    if (org) {
      if (org.ownerLogin === req.user.username) {
        Repo.find({ 'orgLogin': aula, assignName: tarea }, (err, repos) => {
          if (err) console.log(err)

          res.render('assignments/assign', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula, assigns: repos })
        })
      } else {
        res.redirect('/classrooms')
      }
    } else {
      res.render('assignments/assign', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula })
    }
  })
}

// Controller for get the assign invitation page.
function assignInvi (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let titulo = 'Tarea ' + req.params.idassign

  res.render('assignments/invitation', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula })
}

// Controller for  add a member to the individual assign.
function assignInviP (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let repo = tarea + '-' + req.user.username
  let estudiante = req.user.username
  let permisos

  Assign.findOne({ 'orgLogin': aula }, (err, assign) => {
    if (err) console.log(err)

    if (assign.userAdmin) { permisos = 'admin' } else { permisos = 'push' }

    if (!assign.isActive) {
      return res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'Ya no puedes aceptar esta tarea, está deshabilitado.' })
    } else {
      User.findOne({ 'login': assign.ownerLogin }, (err, user) => {
        if (err) console.log(err)

        let newRepo = new Repo({
          name: repo,
          assignName: tarea,
          StudentLogin: estudiante,
          ownerLogin: user.login,
          orgLogin: aula
        })

        newRepo.save((err) => {
          if (err) res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'La tarea ya ha sido aceptada' })
        })

        const ghUser = new Github(user.token)

        ghUser.createRepo(aula, repo, 'Repo created by CodeLab', assign.repoType)
        .then(result => {
          ghUser.addCollaborator(aula, repo, estudiante, permisos)
          .then(result => {
            console.log(result)
            res.redirect('https://github.com/' + aula + '/' + repo)
          })
          .catch(error => {
            console.log(error)

            res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'El colaborador ya forma parte del repositorio' })
          })
        })
        .catch(error => {
          console.log(error)
          res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'La tarea ya ha sido aceptada' })
        })
      })
    }
  })
}

// Controller for get the group invi page.
function groupInvi (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let titulo = 'Tarea ' + req.params.idassign

  Team.find({ org: aula }, (err, teams) => {
    if (err) console.log(err)

    res.render('assignments/groupInvi', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula, equipos: teams })
  })
}

// Controller for  add a member to the group assign.
function groupInviP (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign
  let teamName = req.body.team
  let repo = tarea + '-' + teamName

  Assign.findOne({ 'orgLogin': aula }, (err, assign) => {
    if (err) console.log(err)

    if (!assign.isActive) {
      return res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'Ya no puedes aceptar esta tarea, está deshabilitado.' })
    } else {
      User.findOne({ 'login': assign.ownerLogin }, (err, user) => {
        if (err) console.log(err)

        Team.findOne({ 'name': teamName }, (err, team) => {
          if (err) console.log(err)

          Team.update({ name: team.name }, { $push: {members: req.user.username} }, (err) => {
            if (err) console.log(err)
          })

          const ghUser = new Github(user.token)

          ghUser.addMember(team.id, req.user.username)
          .then(result => {
            res.redirect('https://github.com/' + aula + '/' + repo)
          })
          .catch(error => {
            console.log(error)
            res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'El miembro ya forma parte del equipo' })
          })
        })
      })
    }
  })
}
// Controller for get the group assign page.
function groupAssign (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let titulo = 'Tarea ' + req.params.idassign
  Org.findOne({ 'login': aula }, (err, org) => {
    if (err) console.log(err)

    if (org) {
      if (org.ownerLogin === req.user.username) {
        Group.find({ 'orgLogin': aula, assignName: tarea }, (err, repos) => {
          if (err) console.log(err)

          res.render('assignments/groupAssign', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula, assigns: repos })
        })
      } else {
        res.redirect('/classrooms')
      }
    } else {
      res.render('assignments/groupAssign', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula })
    }
  })
}

// Controller for get the newteams page
function team (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign
  let titulo = 'Nuevo equipo'

  res.render('assignments/newTeam', { titulo: titulo, usuario: req.user, classroom: aula, assign: tarea })
}

// Controller for create a new team and an new group assign
function teamP (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign
  let teamFormated = req.body.team.replace(nameFormat, '-')
  let repo = tarea + '-' + teamFormated
  let idTeam

  Assign.findOne({ 'orgLogin': aula }, (err, assign) => {
    if (err) console.log(err)

    if (!assign.isActive) {
      return res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'Ya no puedes aceptar esta tarea, está deshabilitado.' })
    } else {
      User.findOne({ 'login': assign.ownerLogin }, (err, user) => {
        if (err) console.log(err)

        const ghUser = new Github(user.token)
        ghUser.createTeam(aula, teamFormated, [req.user.username])
        .then(result => {
          let newTeam = new Team({
            name: teamFormated,
            id: result.data.id,
            members: [req.user.username],
            org: aula
          })

          newTeam.save((err) => {
            if (err) console.log(err)
          })

          idTeam = result.data.id
          let newGroup = new Group({
            name: repo,
            assignName: tarea,
            team: teamFormated,
            idTeam: idTeam,
            ownerLogin: user.login,
            orgLogin: aula
          })

          newGroup.save((err) => {
            if (err) console.log(err)
          })

          ghUser.createRepo(aula, repo, 'Repo created by CodeLab', assign.assignType)
          .then(result => {
            ghUser.addTeam(idTeam, aula, repo)
            .then(result => {
              res.redirect('https://github.com/' + aula + '/' + repo)
            })
          })
        })
        .catch(error => {
          console.log(error)
          res.render('static_pages/error', { titulo: 'Error', usuario: req.user, msg: 'El equipo ya existe' })
        })
      })
    }
  })
}

// Controller for get the assign options
function optionsG (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign

  Org.findOne({ 'login': aula }, (err, org) => {
    if (err) console.log(err)

    if (org.ownerLogin === req.user.username) {
      Assign.findOne({ 'orgLogin': aula, titulo: tarea }, (err, assign) => {
        if (err) console.log(err)

        res.render('assignments/options', { titulo: 'Opciones', usuario: req.user, classroom: aula, assign: tarea, activado: assign.isActive })
      })
    } else {
      res.redirect('/classrooms')
    }
  })
}

// Controller for save the options page
function optionsP (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign

  if (req.body.activador) {
    Assign.findOneAndUpdate({ titulo: tarea }, { isActive: true }, (err) => {
      if (err) console.log(err)
    })
  } else {
    Assign.findOneAndUpdate({ titulo: tarea }, { isActive: false }, (err) => {
      if (err) console.log(err)
    })
  }
  res.redirect('/assign/' + aula + '/' + tarea)
}

function evalRepo (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign
  let evalRepo = 'eval-' + tarea
  let readme = '# Eval repo\n' + 'Clone and exec ```./eval.sh``` for get all the students repos'

  evaluationRepo(aula, tarea, req.user.username)
  .then(result => {
    User.findOne({ 'login': req.user.username }, (err, usr) => {
      if (err) console.log(err)

      const ghUser = new Github(usr.token)
      ghUser.createRepo(aula, evalRepo, 'Repo created by CodeLab', 1)
      .then(res => {
        ghUser.createFile(aula, evalRepo, 'eval.sh', 'adding eval.sh :bookmark:', result)
        .then(res => {
          console.log(res.meta.status)
        })
        .catch(err => {
          console.log(err)
        })
        ghUser.createFile(aula, evalRepo, 'README.md', 'adding README :information_source:', base64.encode(utf8.encode(readme)))
        .then(res => {
          console.log(res.meta.status)
          res.redirect('https://github.com/' + aula + '/' + evalRepo)
        })
        .catch(err => {
          console.log(err)
        })
      })
      .catch(err => {
        res.redirect('https://github.com/' + aula + '/' + evalRepo)
        console.log(err)
      })
    })
  })
  .catch(error => {
    console.log(error)
  })
}

module.exports = {
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
