const setup = require('./index')
const express = require('express')
const formatter = require('../../../formatters/forecastFormatter')
const darksky = require('../../../services/darkskyService')
const geocode = require('../../../services/googleGeocodeService')
const router = express.Router()
const paramCheck = setup.paramChecker
const findKey = setup.findByKey
const db = setup.database

router.post('/', (request, response) => {
  (async () => {
    const req = request.body
    const userId = await findKey(req.api_key).then(result => result)

    if (userId) {
      paramCheck(req, response, ['location', 'api_key'])
      db('favorites').insert({ location: req.location, user_id: userId.id })
        .then(like => {
          response.status(200).send({ message: `${req.location} has been added to your favorites` })
        })
        .catch(error => {
          response.status(500).send({ error })
        })
    } else {
      response.status(422).send({ error: 'Bad api_key' })
    }
  })()
})

router.delete('/', (request, response) => {
  (async () => {
    const req = request.body
    const userId = await findKey(req.api_key).then(result => result)

    if (userId) {
      paramCheck(req, response, ['location', 'api_key'])
      db('favorites').where('location', req.location).del()
        .then(like => {
          response.status(204).send({ status: '204' })
        })
        .catch(error => {
          response.status(500).send({ error })
        })
    } else {
      response.status(422).send({ error: 'Bad api_key' })
    }
  })()
})

router.get('/', (request, response) => {
  (async () => {
    const req = request.body
    const userId = await findKey(req.api_key).then(result => result)
    if (userId) {
      paramCheck(req, response, ['api_key'])
      const favorites = await db('favorites').where('user_id', userId.id).then(result => result)
      response.status(200).send(await mapFavs(favorites))
    } else {
      response.status(422).send({ error: 'Bad api_key' })
    }
  })()
})

async function mapFavs (favorites) {
  const forecasts = []
  await asyncForEach(favorites, async (favorite) => {
    var coordinates = (await geocode(favorite.location).then(response => response.json())).results[0].geometry.location
    var darkdata = await darksky(coordinates).then(response => response.json())
    forecasts.push(formatter.formatCurrently(darkdata))
  })
  return forecasts
}

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

module.exports = router