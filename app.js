'use strict'

const express = require('express')
const app = express()
const passport = require('passport')
const strategy = require('passport-github').Strategy
const morgan = require('morgan')
const cookie = require('cookie-parser')
const body = require('body-parser')
const session = require('express-session')
const path = require('path')

const github = require('./config/configPassport')
const api = require('./config/routes')

app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

app.use(morgan('combined'))
app.use(cookie())
app.use(session({ secret: 'tfg1718', resave: true, saveUninitialized: true }))
app.use(body.urlencoded({extended: true}))
app.use(body.json())
app.use(passport.initialize())
app.use(passport.session())
app.use('/', api)

module.exports = app
