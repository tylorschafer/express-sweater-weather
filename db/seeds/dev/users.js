exports.seed = function (knex) {
  return knex('users').del()
    .then(() => {
      return Promise.all([
        knex('users').insert({
          api_key: 'ts12345'
        }, 'id')
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
}
