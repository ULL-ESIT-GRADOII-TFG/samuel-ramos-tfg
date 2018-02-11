'use strict'

const passport = require('passport')
const loggedIn = require('connect-ensure-login')
const express = require('express')
const api = express.Router()

const appControllers = require('../app/controllers/applicationControllers.js')
const classControllers = require('../app/controllers/classroomControllers.js')

api.get('/', appControllers.home)
api.get('/login', appControllers.redirectHome)
api.get('/login/github', passport.authenticate('github'))
api.get('/login/github/return', passport.authenticate('github', { failureRedirect: '/login' }), appControllers.redirectHome)
api.get('/profile', loggedIn.ensureLoggedIn(), appControllers.profiles)
api.get('/logout', loggedIn.ensureLoggedIn(), appControllers.logout)
api.get('/classrooms', loggedIn.ensureLoggedIn(), classControllers.classrooms)
api.get('/orgs', loggedIn.ensureLoggedIn(), classControllers.orgs)
api.post('/orgs', loggedIn.ensureLoggedIn(), classControllers.orgsP)

module.exports = api
