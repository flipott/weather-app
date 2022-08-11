const infoDiv = document.getElementById("information");
const confirmSearch = document.getElementById("confirm-search");

function processWeatherData(weatherData) {
  const currentLocation = weatherData.name;
  const currentTemp = weatherData.main.temp;
  const currentMinTemp = weatherData.main.temp_min;
  const currentMaxTemp = weatherData.main.temp_max;
  const currentHumidity = weatherData.main.humidity;
  const currentSky = weatherData.weather[0].description;
  const currentSunrise = weatherData.sys.sunrise;
  const currentSunset = weatherData.sys.sunset;

  const weatherObj = {
    currentLocation,
    currentTemp,
    currentMinTemp,
    currentMaxTemp,
    currentHumidity,
    currentSky,
    currentSunrise,
    currentSunset,
  };

  return weatherObj;
}

function displayWeatherData(currentWeather) {
  for (const key in currentWeather) {
    console.log(`${key}: ${currentWeather[key]}`);
  }
}

async function getWeatherData(apiURL) {
  const response = await fetch(apiURL, { mode: "cors" });
  const weatherData = await response.json();

  if (weatherData.cod === "404" || weatherData.cod === "400") {
    console.log("Please enter a valid city.");
  } else {
    const currentWeather = processWeatherData(weatherData);
    displayWeatherData(currentWeather);
  }
}

confirmSearch.addEventListener("click", () => {
  const search = document.getElementById("search").value;

  const apiKey = "c2465f0304172a924dec96df78fca3f6";
  const measurementUnit = "imperial";
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}&units=${measurementUnit}`;

  getWeatherData(apiURL);
  document.getElementById("search").value = "";
});
