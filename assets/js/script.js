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
var city = document.querySelector("#city");
var cityArray = [];
var weatherUrl =
  "http://api.openweathermap.org/data/2.5/weather?q=" +
  city +
  "&appid=" +
  apiKey;

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
console.log(iconEl);
function getApi(event) {
  event.preventDefault();

  var city = document.querySelector("#city").value.trim().toUpperCase();
  // if(cityArray.includes(city)) {
  //   console.log(cityArray);
  //   return
  // }
  // cityArray.push(city)
  // console.log(cityArray);

  console.log(city);
  if (!city) {
    city = event.target.innerHTML;
    console.log(city);
  }

  console.log(event.target);
  var weatherUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey;

  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      cityNameEl.textContent = `${data.name} (${today})`;
      var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=hourly,minutely&appid=${apiKey}&units=imperial`;
      fetch(oneCallUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);

          // dataArray = Object.keys(data.daily[i].weather[i])
          // console.log(dataArray);

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
            console.log(day);
            console.log(dayTempElArray);
            dayTempElArray[i].textContent = `Temp: ${day.temp.day} \u00B0 F`;
            console.log(day.weather[0]);
            console.log(dayTempElArray);
            console.log(data.daily[i]);
            console.log(day.weather[0].icon);

            iconElArray[
              i
            ].src = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
            console.log(iconElArray[i]);
            windElArray[i].textContent = `Wind Speed: ${day.wind_speed} MPH`;
            console.log(windElArray);
            humidityElArray[i].textContent = `Humidity: ${day.humidity} %`;
            // renderLastSearched();
            // function renderLastSearched() {
            //   lastSearchedCity = localStorage.getItem("City");

            //   city.textContent = lastSearchedCity;
            // }

            // localStorage.setItem("City", city);
            // console.log(city);
            // renderLastSearched();
          }
        });
      if (!cityArray.includes(city)) {
        console.log(cityArray);
      } else {
        return;
      }
      cityArray.push(city);
      console.log(cityArray);
      document.querySelector("#city").value = "";

      var searchedCity = document.createElement("button");
      searchedCity.textContent = data.name;

      searchedCity.setAttribute("style", "width: 50%");

      searchedCity.classList.add(
        "col",
        "btn",
        "btn-sm",
        "btn-primary",
        "btn-block"
      );
      searchList.appendChild(searchedCity);
      searchedCity.addEventListener("click", getApi);
      
      function renderLastSearched() {
        localStorage.getItem("City");
       city.textContent = "City".value
      }

      localStorage.setItem("City", city);
      console.log(city);

     
      renderLastSearched();
    });
}
searchForm.addEventListener("submit", getApi);

// saveButton10.addEventListener("click", function (event) {
//   event.preventDefault();

//   var text10 = document.querySelector("#ten").value;

//   localStorage.setItem("list10", text10);
//   renderLastSearched();
// });
