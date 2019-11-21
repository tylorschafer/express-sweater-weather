var express = require('express')
var router = express.Router()

const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../../knexfile')[environment]
const database = require('knex')(configuration)
const fetch = require('node-fetch')

router.get('/', (request, response) => {
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_API_KEY}&address=denver, co`)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch((error) => console.error({ error }))
})

module.exports = router
