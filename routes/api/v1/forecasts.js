var express = require('express')
var router = express.Router()

const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../../knexfile')[environment]
const database = require('knex')(configuration)
const fetch = require('node-fetch')

function findByKey (key) {
  return database.select('id').from('users').where('api_key', key).first()
}

function googleGeocode (address) {
  return fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_API_KEY}&address=${address}`)
    .catch((error) => console.error({ error }))
}

router.get('/', (request, response) => {
  (async () => {
    const key = request.body.api_key
    const userId = await findByKey(key).then(result => { return result })
    const address = request.query.location

    if (userId) {
      var coordinates = (await googleGeocode(address).then(response => response.json())).results[0].geometry.location
      return console.log(coordinates)
    } else {
      response.status(422).send({ error: 'Bad api_key' })
    }
  })()
})

module.exports = router
