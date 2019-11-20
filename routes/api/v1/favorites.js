var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

app.post('api/v1/favorites', (request, response) => {
  const favorite = request.body 

  for (let requiredParameter of ['location', 'api_key']) {
    if (!favorite[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { location: <STRING>, api_key: <STRING}. You're missing a "${requiredParameter}" property.` })
    }
  }

})

module.exports = router;