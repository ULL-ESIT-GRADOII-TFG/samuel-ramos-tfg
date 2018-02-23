const Github = require('../helpers/githubHelper').Gh
const User = require('../models/user')
const Org = require('../models/org')
const Assign = require('../models/assign')
const Repo = require('../models/repo')
const Group = require('../models/group')
const Team = require('../models/team')

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

function newAssignP (req, res) {
  let orgLogin = req.params.idclass
  Org.findOne({ 'login': orgLogin }, (err, org) => {
    if (err) console.log(err)

    if (org.ownerLogin === req.user.username) {
      let newAssign = new Assign({
        titulo: req.body.titulo,
        ownerLogin: req.user.username,
        assignType: req.body.type,
        repoType: req.body.repo,
        userAdmin: req.body.admin,
        orgLogin: orgLogin
      })

      newAssign.save((err) => {
        if (err) console.log(err)

        res.redirect('/classroom/' + orgLogin)
      })
    } else {
      res.redirect('/classrooms')
    }
  })
}

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

function assignInvi (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  console.log(tarea)
  let titulo = 'Tarea ' + req.params.idassign

  res.render('assignments/invitation', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula })
}

function assignInviP (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let repo = tarea + '-' + req.user.username
  let estudiante = req.user.username

  Org.findOne({ 'login': aula }, (err, org) => {
    if (err) console.log(err)

    User.findOne({ 'login': org.ownerLogin }, (err, user) => {
      if (err) console.log(err)

      console.log('hola')
      let newRepo = new Repo({
        name: repo,
        assignName: tarea,
        StudentLogin: estudiante,
        ownerLogin: user.login,
        orgLogin: aula
      })

      newRepo.save((err) => {
        if (err) console.log(err)
      })

      const ghUser = new Github(user.token)

      ghUser.createRepo(aula, repo, 'Repo created by CodeLab', false, req.user.id)
      .then(result => {
        console.log(result)

        ghUser.addCollaborator(aula, repo, estudiante)
        .then(result => {
          console.log(result)
        })
      })
    })
  })
}

function groupInvi (req, res) {
  let tarea = req.params.idassign
  let aula = req.params.idclass
  let titulo = 'Tarea ' + req.params.idassign
  Team.find({ org: aula }, (err, teams) => {
    if (err) console.log(err)

    res.render('assignments/groupInvi', { titulo: titulo, usuario: req.user, assign: tarea, classroom: aula, equipos: teams })
  })
}

function groupInviP (req, res) {
  let aula = req.params.idclass
  let teamName = req.body.team

  Org.findOne({ 'login': aula }, (err, org) => {
    if (err) console.log(err)

    User.findOne({ 'login': org.ownerLogin }, (err, user) => {
      if (err) console.log(err)

      Team.findOne({ 'name': teamName }, (err, team) => {
        if (err) console.log(err)

        const ghUser = new Github(user.token)

        ghUser.addMember(team.id, req.user.username)
        .then(result => {
          console.log(result)
        })
      })
    })
  })
}

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

function team (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign
  let titulo = 'Nuevo equipo'

  res.render('assignments/newTeam', { titulo: titulo, usuario: req.user, classroom: aula, assign: tarea })
}

function teamP (req, res) {
  let aula = req.params.idclass
  let tarea = req.params.idassign
  let team = req.body.team
  let repo = tarea + '-' + team
  let idTeam

  Org.findOne({ 'login': aula }, (err, org) => {
    if (err) console.log(err)

    User.findOne({ 'login': org.ownerLogin }, (err, user) => {
      if (err) console.log(err)

      const ghUser = new Github(user.token)
      ghUser.createTeam(aula, team, [req.user.username])
      .then(result => {
        console.log(result)

        let newTeam = new Team({
          name: team,
          id: result.data.id,
          members: [req.user.username],
          org: aula
        })

        newTeam.save((err) => {
          if (err) console.log(err)

          res.redirect('/groupinvitation/' + aula + '/' + tarea)
        })

        idTeam = result.data.id
        let newGroup = new Group({
          name: repo,
          assignName: tarea,
          team: team,
          idTeam: idTeam,
          ownerLogin: user.login,
          orgLogin: aula
        })

        newGroup.save((err) => {
          if (err) console.log(err)
        })

        ghUser.createRepo(aula, repo, 'Repo created by CodeLab', false)
      .then(result => {
        console.log(result)

        ghUser.addTeam(idTeam, aula, repo)
        .then(result => {
          console.log(result)
        })
      })
      })
    })
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
  teamP
}
