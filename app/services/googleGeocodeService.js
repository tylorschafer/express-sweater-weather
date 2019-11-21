const fetch = require('node-fetch')

function googleGeocode (address) {
  return fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_API_KEY}&address=${address}`)
    .catch((error) => console.error({ error }))
}

module.exports = googleGeocode
