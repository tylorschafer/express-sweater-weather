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

function darkskyForecast (coordinates) {
  const lat = coordinates.lat 
  const long = coordinates.lng 
  return fetch(`https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${long}`)
    .catch((error) => console.error({ error }))
}

function formatCurrently (darkResponse) {
  let result = {}
  result['summary'] = darkResponse.currently.summary
  result['icon'] = darkResponse.currently.icon
  result['precipIntensity'] = darkResponse.currently.precipIntensity
  result['precipProbability'] = darkResponse.currently.precipProbability
  result['temperature'] = darkResponse.currently.temperature
  result['humidity'] = darkResponse.currently.humidity
  result['pressure'] = darkResponse.currently.pressure
  result['windSpeed'] = darkResponse.currently.windSpeed
  result['windGust'] = darkResponse.currently.windGust
  result['windBearing'] = darkResponse.currently.windBearing
  result['cloudCover'] = darkResponse.currently.cloudCover
  result['visibility'] = darkResponse.currently.visibility
  return result
}

router.get('/', (request, response) => {
  (async () => {
    const key = request.body.api_key
    const userId = await findByKey(key).then(result => { return result })
    const address = request.query.location

    if (userId) {
      var coordinates = (await googleGeocode(address).then(response => response.json())).results[0].geometry.location
      var forecast = (await darkskyForecast(coordinates).then(response => response.json()))
      return console.log(await formatCurrently(forecast))
    } else {
      response.status(422).send({ error: 'Bad api_key' })
    }
  })()
})

module.exports = router
