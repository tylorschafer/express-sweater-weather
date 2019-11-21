const setup = require('./index')
const router = setup.router
const findKey = setup.findByKey
const db = setup.database
const formatter = require('../../../formatters/forecastFormatter')
const darksky = require('../../../services/darkskyService')
const geocode = require('../../../services/googleGeocodeService')

router.post('/', (request, response) => {
  (async () => {
    const favorite = request.body
    const userId = await findKey(favorite.api_key).then(function (result) { return result })

    if (await userId) {
      for (const requiredParameter of ['location', 'api_key']) {
        if (!favorite[requiredParameter]) {
          return response
            .status(422)
            .send({ error: `Expected format: { location: <STRING>, api_key: <STRING}. You're missing a "${requiredParameter}" property.` })
        }
      }

      db('favorites').insert({ location: await favorite.location, user_id: await userId.id })
        .then(like => {
          response.status(200).json({ message: `${favorite.location} has been added to your favorites` })
        })
        .catch(error => {
          response.status(500).json({ error })
        })
    } else {
      response.status(422).send({ error: 'Bad api_key' })
    }
  })()
})

router.delete('/', (request, response) => {
  (async () => {
    const favorite = request.body
    const userId = await findKey(favorite.api_key).then(function (result) { return result })

    if (userId) {
      db('favorites').where('location', favorite.location).del()
        .then(like => {
          response.status(204).json({ status: '204' })
        })
        .catch(error => {
          response.status(500).json({ error })
        })
    } else {
      response.status(422).json({ error: 'Bad api_key' })
    }
  })()
})

router.get('/', (request, response) => {
  (async () => {
    const req = request.body
    const userId = await findKey(req.api_key).then(result => { return result })
    if (userId) {
      var favorites = await db('favorites').where('user_id', userId.id).then(result => { return result })
      var summaries = []
      favorites.forEach(async function (favorite, index) {
        var coordinates = (await geocode(favorite.location).then(response => response.json())).results[0].geometry.location
        var darkdata = await darksky(coordinates).then(response => response.json())
        summaries.push(await formatter.formatCurrently(darkdata))
      })
      return response.status(200).send(summaries)
    } else {
      response.status(422).json({ error: 'Bad api_key' })
    }
  })()
})

module.exports = setup.router
