const cardDiv = document.querySelector(".weather-card");
const cardLocation = document.querySelector(".location");
const cardIcon = document.querySelector(".weather-icon");
const cardDescription = document.querySelector(".weather-description");
const cardCurrentTemp = document.getElementById("current-temp");
const cardMax = document.getElementById("max-num");
const cardMin = document.getElementById("min-num");
const cardHumidity = document.getElementById("humidity");
const cardRise = document.getElementById("rise-num");
const cardSet = document.getElementById("set-num");
const confirmSearch = document.getElementById("confirm-search");

const unitSwitch = document.getElementById("unit-switcher");
let measurementUnit = "imperial";
const apiKey = "c2465f0304172a924dec96df78fca3f6";
let currentDataSet;

function convertTime(time) {
  const date = new Date(0);
  date.setUTCSeconds(time);
  const dateStr = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  return dateStr;
}

function fahrenheitToCelsius(temp) {
  const cel = (temp - 32) * 0.5556;
  return cel;
}

function processWeatherData(weatherData) {
  const currentLocation = weatherData.name;
  const currentTemp = Math.trunc(weatherData.main.temp);
  const currentTempCel = Math.trunc(fahrenheitToCelsius(weatherData.main.temp));
  const currentMinTemp = Math.trunc(weatherData.main.temp_min);
  const currentMinTempCel = Math.trunc(
    fahrenheitToCelsius(weatherData.main.temp_min)
  );
  const currentMaxTemp = Math.trunc(weatherData.main.temp_max);
  const currentMaxTempCel = Math.trunc(
    fahrenheitToCelsius(weatherData.main.temp_max)
  );
  const currentHumidity = Math.trunc(weatherData.main.humidity);
  const currentSky = weatherData.weather[0].description;
  const currentSunrise = convertTime(weatherData.sys.sunrise);
  const currentSunset = convertTime(weatherData.sys.sunset);

  const weatherObj = {
    currentLocation,
    currentTemp,
    currentTempCel,
    currentMinTemp,
    currentMinTempCel,
    currentMaxTemp,
    currentMaxTempCel,
    currentHumidity,
    currentSky,
    currentSunrise,
    currentSunset,
  };

  return weatherObj;
}

function displayWeatherData(currentWeather) {
  cardLocation.textContent = currentWeather.currentLocation;
  cardDescription.textContent = currentWeather.currentSky;
  cardHumidity.textContent = currentWeather.currentHumidity;
  cardRise.textContent = currentWeather.currentSunrise;
  cardSet.textContent = currentWeather.currentSunset;

  if (measurementUnit === "imperial") {
    cardCurrentTemp.textContent = currentWeather.currentTemp;
    cardMax.textContent = currentWeather.currentMaxTemp;
    cardMin.textContent = currentWeather.currentMinTemp;
  } else {
    cardCurrentTemp.textContent = currentWeather.currentTempCel;
    cardMax.textContent = currentWeather.currentMaxTempCel;
    cardMin.textContent = currentWeather.currentMinTempCel;
  }
}

async function getWeatherData(apiURL) {
  try {
    const response = await fetch(apiURL, { mode: "cors" });
    const weatherData = await response.json();
    const currentWeather = processWeatherData(weatherData);
    currentDataSet = currentWeather;
    displayWeatherData(currentWeather);
    cardDiv.style.display = "flex";
    document.getElementById("city-error").style.visibility = "hidden";
  } catch (error) {
    document.getElementById("city-error").style.visibility = "visible";
  }
}

function runWeatherInfo(search) {
  currentSearch = search;
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}&units=imperial`;
  getWeatherData(apiURL);
  document.getElementById("search").value = "";
}

confirmSearch.addEventListener("click", () => {
  const search = document.getElementById("search").value;
  runWeatherInfo(search);
});

unitSwitch.addEventListener("change", () => {
  if (unitSwitch.checked) {
    measurementUnit = "metric";
    displayWeatherData(currentDataSet);
  } else {
    measurementUnit = "imperial";
    displayWeatherData(currentDataSet);
  }
});
