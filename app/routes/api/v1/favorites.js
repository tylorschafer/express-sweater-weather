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
    const userId = await findKey(favorite.api_key).then(result => result)

    if (userId) {
      for (const requiredParameter of ['location', 'api_key']) {
        if (!favorite[requiredParameter]) {
          return response
            .status(422)
            .send({ error: `Expected format: { location: <STRING>, api_key: <STRING}. You're missing a "${requiredParameter}" property.` })
        }
      }

      db('favorites').insert({ location: favorite.location, user_id: userId.id })
        .then(like => {
          response.status(200).send({ message: `${favorite.location} has been added to your favorites` })
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
    const favorite = request.body
    const userId = await findKey(favorite.api_key).then(result => result)

    if (userId) {
      db('favorites').where('location', favorite.location).del()
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
      const favorites = await db('favorites').where('user_id', userId.id).then(result => result)
      response.status(200).send(await mapFavs(favorites))
    } else {
      response.status(422).send({ error: 'Bad api_key' })
    }
  })()
})

// async function mapFavs (favorites) {
//   const summaries = favorites.map(async function (favorite) {
//     var coordinates = (await geocode(favorite.location).then(response => response.json())).results[0].geometry.location
//     var darkdata = await darksky(coordinates).then(response => response.json())
//     formatter.formatCurrently(darkdata)
//   })
//   console.log(summaries)
// }

async function mapFavs (favorites) {
  const forecasts = []
  await asyncForEach(favorites, async (favorite) => {
    var coordinates = (await geocode(favorite.location).then(response => response.json())).results[0].geometry.location
    var darkdata = await darksky(coordinates).then(response => response.json())
    forecasts.push(formatter.formatCurrently(darkdata))
  })
  return forecasts
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = setup.router
