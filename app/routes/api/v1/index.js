const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../../../knexfile')[environment]
const database = require('knex')(configuration)
const fetch = require('node-fetch')

function findByKey (key) {
  return database.select('id').from('users').where('api_key', key).first()
}

function paramChecker (req, response, params) {
  for (const requiredParameter of params) {
    if (!req[requiredParameter]) {
      return response
        .status(422)
        .json({ error: `Expected format: { param: <STRING>, api_key: <STRING> }. You're missing a "${requiredParameter}" property.` })
    }
  }
}

module.exports = {
  environment: environment,
  configuration: configuration,
  database: database,
  fetch: fetch,
  findByKey: findByKey,
  paramChecker: paramChecker
}
