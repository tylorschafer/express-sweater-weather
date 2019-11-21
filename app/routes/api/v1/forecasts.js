const setup = require('./index')
const formatter = require('../../../formatters/forecastFormatter')
const darksky = require('../../../services/darkskyService')
const geocode = require('../../../services/googleGeocodeService')
const router = setup.router
const findKey = setup.findByKey

router.get('/', (request, response) => {
  (async () => {
    const key = request.body.api_key
    const userId = await findKey(key).then(result => { return result })
    const address = request.query.location

    if (userId) {
      var coordinates = (await geocode(address).then(response => response.json())).results[0].geometry.location
      var darkdata = (await darksky(coordinates).then(response => response.json()))
      var forecast = {}

      forecast.location = address
      forecast.currently = await formatter.formatCurrently(darkdata)
      forecast.hourly = await formatter.formatHourly(darkdata)
      forecast.daily = await formatter.formatDaily(darkdata)

      response.status(200).send(forecast)
    } else {
      response.status(422).send({ error: 'Bad api_key' })
    }
  })()
})

module.exports = setup.router
