const setup = require('./index')
const express = require('express')
const formatter = require('../../../formatters/forecastFormatter')
const darksky = require('../../../services/darkskyService')
const geocode = require('../../../services/googleGeocodeService')
const router = express.Router()
const findKey = setup.findByKey

router.get('/', (request, response) => {
  (async () => {
    const key = request.body.api_key
    const userId = await findKey(key).then(result => { return result })
    const address = request.query.location

    if (userId) {
      console.log((await geocode(address).then(response => response.json())))
      var coordinates = (await geocode(address).then(response => response.json())).results[0].geometry.location
      var darkdata = (await darksky(coordinates).then(response => response.json()))
      var forecast = {}

      forecast.location = address
      forecast.currently = formatter.formatCurrently(darkdata)
      forecast.hourly = formatter.formatHourly(darkdata)
      forecast.daily = formatter.formatDaily(darkdata)

      response.status(200).send(forecast)
    } else {
      response.status(422).send({ error: 'Bad api_key' })
    }
  })()
})

module.exports = router
