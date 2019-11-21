var express = require('express')
var router = express.Router()
const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../../../knexfile')[environment]
const database = require('knex')(configuration)
const fetch = require('node-fetch')

function findByKey (key) {
  return database.select('id').from('users').where('api_key', key).first()
}

module.exports = {
  express: express,
  router: router,
  environment: environment,
  configuration: configuration,
  database: database,
  fetch: fetch,
  findByKey: findByKey
}
