var express = require('express')
var router = express.Router()

const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../../knexfile')[environment]
const database = require('knex')(configuration)

router.post('/', (request, response) => {
  const favorite = request.body

  for (const requiredParameter of ['location', 'api_key']) {
    if (!favorite[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { location: <STRING>, api_key: <STRING}. You're missing a "${requiredParameter}" property.` })
    }
  }
  database('favorites').insert(favorite, 'id')
    .then(favorite => {
      response.status(200).json({ message: `"${favorite.location}" has been added to your favorites` })
    })
    .catch(error => {
      response.status(500).json({ error });
    })
})

module.exports = router
