'use strict'

const passport = require('passport')
const loggedIn = require('connect-ensure-login')
const express = require('express')
const api = express.Router()

const appControllers = require('../app/controllers/applicationControllers.js')

api.get('/', appControllers.home)
api.get('/login', appControllers.login)
api.get('/login/github', passport.authenticate('github'))
api.get('/login/github/return', passport.authenticate('github', { failureRedirect: '/login' }), appControllers.redirectHome)
api.get('/profile', loggedIn.ensureLoggedIn(), appControllers.profiles)

module.exports = api
