const setup = require('./index')

setup.router.post('/', (request, response) => {
  (async () => {
    const favorite = request.body
    const userId = await setup.findByKey(favorite.api_key).then(function (result) { return result })

    if (await userId) {
      for (const requiredParameter of ['location', 'api_key']) {
        if (!favorite[requiredParameter]) {
          return response
            .status(422)
            .send({ error: `Expected format: { location: <STRING>, api_key: <STRING}. You're missing a "${requiredParameter}" property.` })
        }
      }

      setup.database('favorites').insert({ location: await favorite.location, user_id: await userId.id })
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

setup.router.delete('/', (request, response) => {
  (async () => {
    const favorite = request.body
    const userId = await findByKey(favorite.api_key).then(function (result) { return result })

    if (userId) {
      setup.database('favorites').where('location', favorite.location).del()
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

module.exports = setup.router
