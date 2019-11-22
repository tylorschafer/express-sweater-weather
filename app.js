var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]

var indexRouter = require('./app/routes/index')
var favoritesRouter = require('./app/routes/api/v1/favorites')
var forecastsRouter = require('./app/routes/api/v1/forecasts')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/api/v1/favorites', favoritesRouter)
app.use('/api/v1/forecast', forecastsRouter)

require('dotenv').config()
module.exports = app
