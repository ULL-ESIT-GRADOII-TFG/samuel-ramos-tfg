'use strict'

import passport from 'passport'
import loggedIn from 'connect-ensure-login'
import express from 'express'

import * as appControllers from '../app/controllers/applicationControllers.js'
import * as classControllers from '../app/controllers/classroomControllers.js'
import * as assignControllers from '../app/controllers/assignControllers.js'

const api = express.Router()

// Rutas get
api.get('/', appControllers.home)
api.get('/login', appControllers.redirectHome)
api.get('/help', appControllers.help)
api.get('/login/github', passport.authenticate('github'))
api.get('/login/github/return', passport.authenticate('github', { failureRedirect: '/login' }), appControllers.redirectHome)
api.get('/profile', loggedIn.ensureLoggedIn(), appControllers.profiles)
api.get('/error', loggedIn.ensureLoggedIn(), appControllers.err)
api.get('/logout', loggedIn.ensureLoggedIn(), appControllers.logout)
api.get('/classrooms', loggedIn.ensureLoggedIn(), classControllers.classrooms)
api.get('/orgs', loggedIn.ensureLoggedIn(), classControllers.orgs)
api.get('/invitation/:idclass', loggedIn.ensureLoggedIn(), classControllers.invi)
api.get('/classroom/:idclass', loggedIn.ensureLoggedIn(), classControllers.classroom)
api.get('/options/:idclass', loggedIn.ensureLoggedIn(), classControllers.options)
api.get('/upload/:idclass', loggedIn.ensureLoggedIn(), classControllers.load)
api.get('/alumnos/:idclass', loggedIn.ensureLoggedIn(), classControllers.students)
api.get('/new/:idclass', loggedIn.ensureLoggedIn(), assignControllers.newAssign)
api.get('/assign/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.assign)
api.get('/groupassign/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.groupAssign)
api.get('/assigninvitation/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.assignInvi)
api.get('/groupinvitation/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.groupInvi)
api.get('/newteam/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.team)
api.get('/options/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.optionsG)

// Rutas post
api.post('/file/:idclass', loggedIn.ensureLoggedIn(), classControllers.file)
api.post('/invitation/:idclass', loggedIn.ensureLoggedIn(), classControllers.inviP)
api.post('/orgs', loggedIn.ensureLoggedIn(), classControllers.orgsP)
api.post('/options/:idclass', loggedIn.ensureLoggedIn(), classControllers.optionsP)
api.post('/options/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.optionsP)
api.post('/team/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.teamP)
api.post('/assigninvitation/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.assignInviP)
api.post('/groupinvitation/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.groupInviP)
api.post('/new/:idclass', loggedIn.ensureLoggedIn(), assignControllers.newAssignP)
api.post('/evalrepo/:idclass/:idassign', loggedIn.ensureLoggedIn(), assignControllers.evalRepo)

module.exports = api
