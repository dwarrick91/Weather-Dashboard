// GIVEN a weather dashboard with form inputs

// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// var apiKey = "f1624d9bbc11ce1b43689070c87ae1f";
var apiKey = "75d035b78716373a15635dcf36329a5b";
var cityInputEl = document.querySelector("#city");
var searchHistory = [];

var searchList = document.querySelector("ul");
var searchForm = document.querySelector("form");
var cityNameEl = document.querySelector("#cityName");
var currentTempEl = document.querySelector("#currentTemp");
var currentWindEl = document.querySelector("#currentWind");
var currentHumidityEl = document.querySelector("#currentHumidity");
var currentUvIndexEl = document.querySelector("#currentUvIndex");

var today = moment().format("dddd MMM Do, YYYY");
var day1El = document.querySelector("#day1");
var day2El = document.querySelector("#day2");
var day3El = document.querySelector("#day3");
var day4El = document.querySelector("#day4");
var day5El = document.querySelector("#day5");

var dayTempEl = document.querySelectorAll(".dayTemp");
var dayTempElArray = Array.from(dayTempEl);
var iconEl = document.querySelectorAll(".icon");
var iconElArray = Array.from(iconEl);
var windEl = document.querySelectorAll(".wind");
var windElArray = Array.from(windEl);
var humidityEl = document.querySelectorAll(".humidity");
var humidityElArray = Array.from(humidityEl);

//when we click search button
// then we get input value
// then validate input
// if no input then end function
// make api request with input
function getWeatherData(cityName) {
  var weatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    apiKey;

  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // update page to display cityName
      cityNameEl.textContent = `${data.name} (${today})`;

      var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=hourly,minutely&appid=${apiKey}&units=imperial`;

      fetch(oneCallUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          // passed data to display results funtion
          displayResults(data);
        });
      // If city name is already in history end function
      if (!searchHistory.includes(cityName)) {
        updateLocalStorage(cityName);
        createHistoryBtn(cityName);
      }

     
    });
}
// display results to user
function displayResults(data) {
  currentTempEl.textContent = `temperture ${data.current.temp} \u00B0 F`;
  currentWindEl.textContent = `Wind Speed ${data.current.wind_speed} MPH`;
  currentHumidityEl.textContent = `Humidity ${data.current.humidity} %`;
  currentUvIndexEl.textContent = ` UV Index ${data.current.uvi}`;

  day1El.textContent = moment().add(1, "d").format("dddd MMM Do, YYYY");
  day2El.textContent = moment().add(2, "d").format("dddd MMM Do, YYYY");
  day3El.textContent = moment().add(3, "d").format("dddd MMM Do, YYYY");
  day4El.textContent = moment().add(4, "d").format("dddd MMM Do, YYYY");
  day5El.textContent = moment().add(5, "d").format("dddd MMM Do, YYYY");
  if (data.current.uvi >= 8) {
    currentUvIndexEl.setAttribute("style", "background-color: red");
  } else if (data.current.uvi > 5 && data.current.uvi < 8) {
    currentUvIndexEl.setAttribute("style", "background-color: orange");
  } else if (data.current.uvi > 2 && data.current.uvi < 6) {
    currentUvIndexEl.setAttribute("style", "background-color: yellow");
  } else {
    currentUvIndexEl.setAttribute("style", "background-color: green");
  }

  for (var i = 0; i < data.daily.length - 2; i++) {
    var day = data.daily[i];

    dayTempElArray[i].textContent = `Temp: ${day.temp.day} \u00B0 F`;

    iconElArray[
      i
    ].src = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

    windElArray[i].textContent = `Wind Speed: ${day.wind_speed} MPH`;

    humidityElArray[i].textContent = `Humidity: ${day.humidity} %`;
  }
}
// create history button
function createHistoryBtn(cityName) {
  // create btn element
  var searchedCity = document.createElement("button");
  // add text content to btn
  searchedCity.textContent = cityName;
  // add styling attributes
  searchedCity.setAttribute("style", "width: 50%");
  // add class names
  searchedCity.classList.add(
    "col",
    "btn",
    "btn-sm",
    "btn-primary",
    "btn-block"
  );
  // add data attribute to btn
  searchedCity.setAttribute("data-cityName", cityName);
  searchList.appendChild(searchedCity);
  function handleBtnClick() {
    getWeatherData(cityName);
  }

  searchedCity.addEventListener("click", handleBtnClick);
}
// update local storage
function updateLocalStorage(cityName) {
  //  get copy of current data structure
  var copyAsText = localStorage.getItem("city");
  // if data is found in localStorage, update searchHistory
  if (copyAsText) {
    searchHistory = JSON.parse(copyAsText);
  }

  // modify copy of data structure
  searchHistory.push(cityName);
  // overwrite data structure with modified copy

  localStorage.setItem("city", JSON.stringify(searchHistory));
}
function initializeSearchHistory() {
  //  get copy of current data structure
  var copyAsText = localStorage.getItem("city");
  // if data is found in localStorage, update searchHistory
  if (copyAsText) {
    searchHistory = JSON.parse(copyAsText);
  }
  for (let i = 0; i < searchHistory.length; i++) {
    const cityName = searchHistory[i];
    createHistoryBtn(cityName)
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  // get value from input element
  var city = cityInputEl.value.trim().toUpperCase();
  // reset input element
  cityInputEl.value = "";

  // if no value return
  if (!city) {
    return;
  }
  // call function and pass in city name as argument
  getWeatherData(city);
}
searchForm.addEventListener("submit", handleFormSubmit);
initializeSearchHistory();
