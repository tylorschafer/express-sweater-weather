function formatCurrently (darkResponse) {
  const currently = {}
  currently.summary = darkResponse.currently.summary
  currently.icon = darkResponse.currently.icon
  currently.precipIntensity = darkResponse.currently.precipIntensity
  currently.precipProbability = darkResponse.currently.precipProbability
  currently.temperature = darkResponse.currently.temperature
  currently.humidity = darkResponse.currently.humidity
  currently.pressure = darkResponse.currently.pressure
  currently.windSpeed = darkResponse.currently.windSpeed
  currently.windGust = darkResponse.currently.windGust
  currently.windBearing = darkResponse.currently.windBearing
  currently.cloudCover = darkResponse.currently.cloudCover
  currently.visibility = darkResponse.currently.visibility
  return currently
}

function formatHourly (darkResponse) {
  const hourly = {}
  hourly.summary = darkResponse.hourly.summary
  hourly.icon = darkResponse.hourly.icon
  hourly.data = []
  darkResponse.hourly.data.slice(0, 9).forEach(function (item, index) {
    const hour = {}
    hour.time = item.time
    hour.time = item.summary
    hour.icon = item.icon
    hour.precipIntensity = item.precipIntensity
    hour.precipProbability = item.precipProbability
    hour.temperature = item.temperature
    hour.humidity = item.humidity
    hour.pressure = item.pressure
    hour.windSpeed = item.windSpeed
    hour.windGust = item.windGust
    hour.windBearing = item.windBearing
    hour.cloudCover = item.cloudCover
    hour.visibility = item.visibility
    hourly.data.push(hour)
  })
  return hourly
}

function formatDaily (darkResponse) {
  const daily = {}
  daily.summary = darkResponse.daily.summary
  daily.icon = darkResponse.daily.icon
  daily.data = []
  darkResponse.daily.data.slice(0, 7).forEach(function (item, index) {
    const day = {}
    day.time = item.time
    day.summary = item.summary
    day.icon = item.icon
    day.sunriseTime = item.sunriseTime
    day.sunsetTime = item.sunsetTime
    day.precipIntensity = item.precipIntensity
    day.precipIntensityMax = item.precipIntensityMax
    day.precipIntensityMaxTime = item.precipIntensityMaxTime
    day.precipProbability = item.precipProbability
    day.precipType = item.precipType
    day.temperatureLow = item.temperatureLow
    day.humidity = item.humidity
    day.pressure = item.pressure
    day.windSpeed = item.windSpeed
    day.windGust = item.windGust
    day.cloudCover = item.cloudCover
    day.visibility = item.visibility
    day.temperatureMin = item.temperatureMin
    day.temperatureMax = item.temperatureMax

    daily.data.push(day)
  })
  return daily
}

module.exports = {
  formatCurrently: formatCurrently,
  formatHourly: formatHourly,
  formatDaily: formatDaily
}
