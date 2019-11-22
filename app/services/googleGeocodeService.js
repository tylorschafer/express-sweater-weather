const fetch = require('node-fetch')

function googleGeocode (address) {
  console.log(process.env.GOOGLE_API_KEY)
  const data = fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_API_KEY}&address=${address}`)
    .catch((error) => console.error({ error }))
  return data
}

module.exports = googleGeocode
