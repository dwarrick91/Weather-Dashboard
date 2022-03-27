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

var weatherUrl =
  "http://api.openweathermap.org/data/2.5/weather?q=" +
  city +
  "&appid=" +
  apiKey

var searchList = document.querySelector("ul");
var searchForm = document.querySelector("form");
var cityNameEl = document.querySelector("#cityName")
var currentTempEl =document.querySelector("#currentTemp")
var currentWindEl =document.querySelector("#currentWind")
var currentHumidityEl =document.querySelector("#currentHumidity")
var currentUvIndexEl =document.querySelector("#currentUvIndex")
var today = moment().format("MMM Do, YYYY")
var dayEl =document.querySelectorAll(".day")
var dayTempEl =document.querySelectorAll(".dayTemp")
var dayTempElArray = Array.from(dayTempEl)
var iconEl = document.querySelectorAll(".icon")
var iconElArray = Array.from(iconEl)
console.log(iconEl);
function getApi(event) {
    event.preventDefault()
  var city = document.querySelector("#city").value;
  console.log(city);
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
        cityNameEl.textContent = `${data.name} (${today})`
        var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=hourly,minutely&appid=${apiKey}&units=imperial`
        fetch(oneCallUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            console.log(data);
            // dataArray = Object.keys(data.daily[i].weather[i])
            // console.log(dataArray);
            currentTempEl.textContent = `temperture ${data.current.temp} \u00B0 F`
            currentWindEl.textContent = `Wind Speed ${data.current.wind_speed} MPH`
            currentHumidityEl.textContent = `Humidity ${data.current.humidity} %`
            currentUvIndexEl.textContent = ` UV Index ${data.current.uvi}`
           
            // day1El.textContent = moment().add(1, "d").format("MMM Do, YYYY")
            for (var i = 0; i < data.daily.length-3; i++) {
                var day = data.daily[i]
                console.log(day);
                console.log(dayTempElArray);
                dayTempElArray[i].textContent = `Temp: ${day.temp.day} \u00B0 F`
                console.log(day.weather[0]);
                console.log(dayTempElArray);
                console.log(data.daily[i]);
                console.log(day.weather[0].icon);
                
                iconElArray[i].src = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
                console.log(iconElArray[i]);
                // iconImg = document.createElement("img")
                // iconImg.src = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
                // console.log(iconImg);
                // document.getElementsByClassName("icon").appendChild(iconImg)
                // console.log(iconElArray);
                // weatherIconArray = Object.keys(day.weather[0])
                // console.log(weatherIconArray);
                // iconElArray.textContent = `${day.temp.weather}`
                // weatherIconArray = Array.from(day.weather)
                // console.log(weatherIconArray);
                // iconEl.textContent = 
              }
            //   iconElArray[i].textContent = ` ${day.weather.icon}`
            

        })
        var searchedCity = document.createElement("button");
                searchedCity.textContent = data.name;
                searchList.appendChild(searchedCity);
               
      
    });
}
searchForm.addEventListener("submit", getApi);

