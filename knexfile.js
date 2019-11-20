// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/express_sweater_weather_dev',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/express_sweater_weather_test',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: 'postgres://bonwwqxvtklkpz:ba9cd70e8c65b11331229628d63b68e7df854615a07855850599298b07ec103a@ec2-54-235-92-244.compute-1.amazonaws.com:5432/d4liu9ing1tcoh',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
};
