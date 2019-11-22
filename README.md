**Express Sweater Weather**

Express Sweater Weather is a Express node.js REST API that returns deatiled weather data. Users can favorite locations, delete locations, and return current forecasts for all favorited locations. Express Sweater Weather was built in 4 days as a school project at Turing School of Software and design.

**Local Setup** 

1. Fork and Clone down this repo
1. Install all dependecies by navigating to the root project directory in terminal and running the `npm install`.
1. Enter `psql` mode and run `CREATE DATABASE express_sweater_weather_dev;`to create a the PostgreSQL database.
1. Run the table migrations with `knex migrate:latest`
1. Seed the database with `knex seed:run`

**Heroku Production Link**
  * You can access the production endpoints of this application at https://ts-express-sweater-weather.herokuapp.com/
