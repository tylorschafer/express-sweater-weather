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
  let currently = {}
  currently['summary'] = darkResponse.currently.summary
  currently['icon'] = darkResponse.currently.icon
  currently['precipIntensity'] = darkResponse.currently.precipIntensity
  currently['precipProbability'] = darkResponse.currently.precipProbability
  currently['temperature'] = darkResponse.currently.temperature
  currently['humidity'] = darkResponse.currently.humidity
  currently['pressure'] = darkResponse.currently.pressure
  currently['windSpeed'] = darkResponse.currently.windSpeed
  currently['windGust'] = darkResponse.currently.windGust
  currently['windBearing'] = darkResponse.currently.windBearing
  currently['cloudCover'] = darkResponse.currently.cloudCover
  currently['visibility'] = darkResponse.currently.visibility
  return currently
}

function formatHourly (darkResponse) {
  let hourly = {}
  hourly['summary'] = darkResponse.hourly.summary 
  hourly['icon'] = darkResponse.hourly.icon
  hourly['data'] = []
  darkResponse.hourly.data.slice(0, 9).forEach(function (item, index) {
    let hour = {}
    hour['time'] = item.time
    hour['time'] = item.summary
    hour['icon'] = item.icon
    hour['precipIntensity'] = item.precipIntensity
    hour['precipProbability'] = item.precipProbability
    hour['temperature'] = item.temperature
    hour['humidity'] = item.humidity
    hour['pressure'] = item.pressure
    hour['windSpeed'] = item.windSpeed
    hour['windGust'] = item.windGust
    hour['windBearing'] = item.windBearing
    hour['cloudCover'] = item.cloudCover
    hour['visibility'] = item.visibility
    hourly['data'].push(hour)
  })
  return hourly
}

router.get('/', (request, response) => {
  (async () => {
    const key = request.body.api_key
    const userId = await findByKey(key).then(result => { return result })
    const address = request.query.location

    if (userId) {
      var coordinates = (await googleGeocode(address).then(response => response.json())).results[0].geometry.location
      var forecast = (await darkskyForecast(coordinates).then(response => response.json()))
      // return console.log(await formatCurrently(forecast))
      return console.log(await formatHourly(forecast))
    } else {
      response.status(422).send({ error: 'Bad api_key' })
    }
  })()
})

module.exports = router
