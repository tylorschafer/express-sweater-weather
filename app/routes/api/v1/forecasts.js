const setup = require('./index')
const formatter = require('../../../formatters/forecastFormatter')

function googleGeocode (address) {
  return setup.fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_API_KEY}&address=${address}`)
    .catch((error) => console.error({ error }))
}

function darkskyForecast (coordinates) {
  const lat = coordinates.lat
  const long = coordinates.lng
  return setup.fetch(`https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${long}`)
    .catch((error) => console.error({ error }))
}

setup.router.get('/', (request, response) => {
  (async () => {
    const key = request.body.api_key
    const userId = await setup.findByKey(key).then(result => { return result })
    const address = request.query.location

    if (userId) {
      var coordinates = (await googleGeocode(address).then(response => response.json())).results[0].geometry.location
      var darksky = (await darkskyForecast(coordinates).then(response => response.json()))
      var forecast = {}

      forecast.location = address
      forecast.currently = await formatter.formatCurrently(darksky)
      forecast.hourly = await formatter.formatHourly(darksky)
      forecast.daily = await formatter.formatDaily(darksky)

      response.status(200).send(forecast)
    } else {
      response.status(422).send({ error: 'Bad api_key' })
    }
  })()
})

module.exports = setup.router
