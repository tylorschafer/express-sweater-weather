## Express Sweater Weather

Express Sweater Weather is a Express node.js REST API that returns detailed weather data. Users can favorite locations, delete locations, and return current forecasts for all favorited locations.

## Contributor 

Express Sweater Weather was written by Tylor Schafer in 4 days, as a school project at Turing School of Software and design.

## Local Setup

1. Fork and Clone down this repo
1. Install all dependecies by navigating to the root project directory in terminal and running the `npm install`.
1. Enter `psql` mode and run `CREATE DATABASE express_sweater_weather_dev;`to create a the PostgreSQL database.
1. Run the table migrations with `knex migrate:latest`
1. Seed the database with `knex seed:run`

## Heroku Production Link
  * You can access the production endpoints of this application at https://ts-express-sweater-weather.herokuapp.com/

## Database Schema
* Express Sweater Weather Only uses the database to store users and their favorite locations. All other data is consumed through external APIs and formatted back to the user.

![ts-express-sweater-weather-schema](https://dbdiagram.io/embed/5dd77358edf08a25543e3af7)

## Tech Stack
* ESW is a node.js application built with the Express framework
* Knex query builder
* PostgreSQL database
* Heroku production host

## **Endpoints**

**All endpoints must be accessed with a valid api_key sent in the request body.**

```
body:
 {
   api_key: <YOUR_API_KEY>
 }
```

**1.** `GET /api/v1/forecast?location=<YOUR_LOCATION>`
   * Summary: Returns a detailed forecast for chosen location
   * Headers: 
   ``` Content-Type: application/json
       Accept: application/json 
   ```
   * Required Request Body: 
   ```
   body:

   {
     "api_key": "<USER_API_KEY>"
   }
   ```
   * Expected Response: 
   ```
   {
   "location": "Denver, C0",
   "currently": {
       "summary": "Overcast",
       "icon": "cloudy",
       "precipIntensity": 0,
       "precipProbability": 0,
       "temperature": 54.91,
       "humidity": 0.65,
       "pressure": 1020.51,
       "windSpeed": 11.91,
       "windGust": 23.39,
       "windBearing": 294,
       "cloudCover": 1,
       "visibility": 9.12,
     },
   "hourly": {
     "summary": "Partly cloudy throughout the day and breezy this evening.",
     "icon": "wind",
     "data": [
       {
       "time": 1555016400,
       "summary": "Overcast",
       "icon": "cloudy",
       "precipIntensity": 0,
       "precipProbability": 0,
       "temperature": 54.9,
       "humidity": 0.65,
       "pressure": 1020.8,
       "windSpeed": 11.3,
       "windGust": 22.64,
       "windBearing": 293,
       "cloudCover": 1,
       "visibility": 9.02,
       },
     ]
   },
   "daily": {
     "summary": "No precipitation throughout the week, with high temperatures bottoming out at 58°F on Monday.",
     "icon": "clear-day",
     "data": [
       {
         "time": 1554966000,
         "summary": "Partly cloudy throughout the day and breezy in the evening.",
         "icon": "wind",
         "sunriseTime": 1554990063,
         "sunsetTime": 1555036947,
         "precipIntensity": 0.0001,
         "precipIntensityMax": 0.0011,
         "precipIntensityMaxTime": 1555045200,
         "precipProbability": 0.11,
         "precipType": "rain",
         "temperatureHigh": 57.07,
         "temperatureLow": 51.47,
         "humidity": 0.66,
         "pressure": 1020.5,
         "windSpeed": 10.94,
         "windGust": 33.93,
         "cloudCover": 0.38,
         "visibility": 9.51,
         "temperatureMin": 53.49,
         "temperatureMax": 58.44,
       },
     ]
   }
 }
   ```
**2.** `POST /api/v1/favorites`
   * Summary: Adds a location to favorites
   * Headers: 
   ```
   Content-Type: application/json
   Accept: application/json
   ```
   * Required Request Body: 
   ```
   body:

   {
     "location": "<USER_LOCATION>",
     "api_key": "<USER_API_KEY>"
   }
   ```
   * Expected Response: 
   ```
   status: 200
   body:

   {
     "message": "Denver, CO has been added to your favorites",
   }
   ```
**3.** `GET /api/v1/favorites`
   * Summary: Returns a current forecast for all favorited locations.
   * Headers: 
   ```
   Content-Type: application/json
   Accept: application/json
   ```
   * Required Request Body: 
   ```
   body:

   {
     "api_key": "<USER_API_KEY>"
   }
   ```
   * Expected Response: 
   ```
   status: 200
 body:
 [
   {
     "location": "Denver, CO",
     "current_weather": {
       "summary": "Overcast",
       "icon": "cloudy",
       "precipIntensity": 0,
       "precipProbability": 0,
       "temperature": 54.91,
       "humidity": 0.65,
       "pressure": 1020.51,
       "windSpeed": 11.91,
       "windGust": 23.39,
       "windBearing": 294,
       "cloudCover": 1,
       "visibility": 9.12,
     },
     "location": "Golden, CO",
     "current_weather": {
       "summary": "Sunny",
       "icon": "sunny",
       "precipIntensity": 0,
       "precipProbability": 0,
       "temperature": 71.00,
       "humidity": 0.50,
       "pressure": 1015.10,
       "windSpeed": 10.16,
       "windGust": 13.40,
       "windBearing": 200,
       "cloudCover": 0,
       "visibility": 8.11,
     }
   }
 ]
   ```
**4.** `DELETE /api/v1/favorites`
   * Summary: Deletes a location from favorites
   * Headers: 
   ```
   Content-Type: application/json
   Accept: application/json
   ```
   * Required Request Body: 
   ```
   body:

   {
     "location": "<USER_LOCATION>",
     "api_key": "<USER_API_KEY>"
   }
   ```
  * Expected Response: 
  ```
  status: 204
  ```

