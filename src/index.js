// Initialize DOM
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
const loader = document.getElementById("loading-icon");
const unitSwitch = document.getElementById("unit-switcher");
const apiKey = "c2465f0304172a924dec96df78fca3f6";

let measurementUnit = "imperial";
let currentDataSet;

// Show loading icon
function showLoader() {
  loader.classList.add("show");
}

// Hide loading icon
function hideLoader() {
  loader.classList.remove("show");
}

// Convert date from epoch to formatted local time string
function convertTime(time) {
  const date = new Date(0);
  date.setUTCSeconds(time);
  const dateStr = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  return dateStr;
}

// Convert temperature to Celsius
function fahrenheitToCelsius(temp) {
  const cel = (temp - 32) * 0.5556;
  return cel;
}

// Gather necessary weather data to be used
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
  const currentIcon = weatherData.weather[0].icon;

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
    currentIcon,
  };

  return weatherObj;
}

// Display weather data on page
function displayWeatherData(currentWeather) {
  cardLocation.textContent = currentWeather.currentLocation;
  cardDescription.textContent = currentWeather.currentSky;
  cardHumidity.textContent = `${currentWeather.currentHumidity}%`;
  cardRise.textContent = currentWeather.currentSunrise;
  cardSet.textContent = currentWeather.currentSunset;
  cardIcon.innerHTML = `<img src="./images/icons/${currentWeather.currentIcon}.png" />`;

  if (measurementUnit === "imperial") {
    cardCurrentTemp.textContent = `${currentWeather.currentTemp}°`;
    cardMax.textContent = `${currentWeather.currentMaxTemp}°`;
    cardMin.textContent = `${currentWeather.currentMinTemp}°`;
  } else {
    cardCurrentTemp.textContent = `${currentWeather.currentTempCel}°`;
    cardMax.textContent = `${currentWeather.currentMaxTempCel}°`;
    cardMin.textContent = `${currentWeather.currentMinTempCel}°`;
  }
}

// Fetch weather data from API
async function getWeatherData(apiURL) {
  try {
    showLoader();
    const response = await fetch(apiURL, { mode: "cors" });
    const weatherData = await response.json();
    const currentWeather = processWeatherData(weatherData);
    currentDataSet = currentWeather;
    displayWeatherData(currentWeather);
    hideLoader();
    cardDiv.style.display = "flex";
    document.getElementById("city-error").style.visibility = "hidden";
  } catch (error) {
    hideLoader();
    document.getElementById("city-error").style.visibility = "visible";
  }
}

// Run weather functions when search is confirmed
function runWeatherInfo(search) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}&units=imperial`;
  getWeatherData(apiURL);
  document.getElementById("search").value = "";
}

confirmSearch.addEventListener("click", () => {
  const search = document.getElementById("search").value;
  runWeatherInfo(search);
});

document.getElementById("search").addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const search = document.getElementById("search").value;
    runWeatherInfo(search);
    document.getElementById("search").blur();
  }
});

// Change temperature units based on checkbox
unitSwitch.addEventListener("change", () => {
  if (unitSwitch.checked) {
    measurementUnit = "metric";
    displayWeatherData(currentDataSet);
  } else {
    measurementUnit = "imperial";
    displayWeatherData(currentDataSet);
  }
});
