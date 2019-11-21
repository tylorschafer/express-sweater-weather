const fetch = require('node-fetch')

function darkskyForecast (coordinates) {
  const lat = coordinates.lat
  const long = coordinates.lng
  return fetch(`https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${long}`)
    .catch((error) => console.error({ error }))
}

module.exports = darkskyForecast
