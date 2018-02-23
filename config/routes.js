'use strict'

const passport = require('passport')
const loggedIn = require('connect-ensure-login')
const express = require('express')
const api = express.Router()

const appControllers = require('../app/controllers/applicationControllers.js')
const classControllers = require('../app/controllers/classroomControllers.js')
const assignControllers = require('../app/controllers/assignControllers.js')

api.get('/', appControllers.home)
api.get('/login', appControllers.redirectHome)
api.get('/login/github', passport.authenticate('github'))
api.get('/login/github/return', passport.authenticate('github', { failureRedirect: '/login' }), appControllers.redirectHome)
api.get('/profile', loggedIn.ensureLoggedIn(), appControllers.profiles)
api.get('/error', loggedIn.ensureLoggedIn(), appControllers.err)
api.get('/logout', loggedIn.ensureLoggedIn(), appControllers.logout)
api.get('/classrooms', loggedIn.ensureLoggedIn(), classControllers.classrooms)
api.get('/orgs', loggedIn.ensureLoggedIn(), classControllers.orgs)
api.get('/invitation/:idclass', loggedIn.ensureLoggedIn(), classControllers.invi)
api.get('/classroom/:idclass', loggedIn.ensureLoggedIn(), classControllers.classroom)
api.get('/new/:idclass', loggedIn.ensureLoggedIn(), assignControllers.newAssign)
api.get('/assign/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.assign)
api.get('/groupassign/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.groupAssign)
api.get('/assigninvitation/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.assignInvi)
api.get('/groupinvitation/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.groupInvi)
api.get('/newteam/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.team)

api.post('/team/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.teamP)
api.post('/assigninvitation/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.assignInviP)
api.post('/groupinvitation/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.groupInviP)
api.post('/new/:idclass', loggedIn.ensureLoggedIn(), assignControllers.newAssignP)
api.post('/invitation/:idclass', loggedIn.ensureLoggedIn(), classControllers.inviP)
api.post('/orgs', loggedIn.ensureLoggedIn(), classControllers.orgsP)

module.exports = api
