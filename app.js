'use strict'

import express from 'express'
import passport from 'passport'
import Strategy from 'passport-github'
import morgan from 'morgan'
import cookie from 'cookie-parser'
import session from 'express-session'
import { join } from 'path'
import { urlencoded, json } from 'body-parser'

import api from './config/routes'
import configPassport from './config/configPassport'

const app = express()

configPassport(passport, Strategy)

app.set('views', join(__dirname, '/app/views/'))
app.set('view engine', 'pug')

app.use(express.static(join(__dirname, '/public')))
app.use(express.static(join(__dirname, '/bower_components')))

app.use(morgan('combined'))
app.use(cookie())
app.use(session({ secret: 'tfg1718', resave: true, saveUninitialized: true }))
app.use(urlencoded({extended: true}))
app.use(json())
app.use(passport.initialize())
app.use(passport.session())
app.use('/', api)

export default app
