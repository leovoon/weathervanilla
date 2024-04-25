const weather = document.querySelector('.weather');
const searchButton = document.querySelector('button[role="search"]');
const cityInput = document.querySelector('input[type="search"]');
const forecastRow = document.querySelector('.forecast > .grid');
const dateElement = document.querySelector('.header__date');
const geolocateIcons = document.querySelectorAll('.require__geolocate');

const icons = {
    '01d': 'wi-day-sunny',
    '02d': 'wi-day-cloudy',
    '03d': 'wi-cloud',
    '04d': 'wi-cloudy',
    '09d': 'wi-showers',
    '10d': 'wi-rain',
    '11d': 'wi-thunderstorm',
    '13d': 'wi-snow',
    '50d': 'wi-fog',
    '01n': 'wi-night-clear',
    '02n': 'wi-night-alt-cloudy',
    '03n': 'wi-cloud',
    '04n': 'wi-night-cloudy',
    '09n': 'wi-night-showers',
    '10n': 'wi-night-rain',
    '11n': 'wi-night-thunderstorm',
    '13n': 'wi-night-alt-snow',
    '50n': 'wi-night-fog',
};
function printTodayDate() {
    const today = new Date();
    const options = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    };
    dateElement.insertAdjacentText('afterbegin', today.toLocaleString('en-us', options));
}

function getWeekDay(date) {
    const options = { weekday: 'long' };
    return date.toLocaleString('en-us', options);
}

function removeChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


function renderForecast(forecast) {
    removeChildren(forecastRow);
    forecast.forEach((weatherData) => {
        const markup = `<div class="card">
        <div>
            <h3 class="forecast__date">${getWeekDay(new Date(weatherData.dt * 1000))}</h3>
            <i class='wi ${icons[weatherData.weather[0].icon]} forecast__icon'></i>
            <p class="forecast__temp">${Math.floor(weatherData.main.temp)}°C</p>
            <p class="forecast__desc">${weatherData.weather[0].main}</p>
        </div>
     </div>`;
        forecastRow.insertAdjacentHTML('beforeend', markup);
    });
}

function getForecast(url) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const forecastData = data.list.filter((obj) => obj.dt_txt.endsWith('06:00:00'));
            renderForecast(forecastData);
        });
}
function getCityWeather(url) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            if (data.cod !== 200) {
                alert(data.message)
                return
            }

            const markup = `<h1 class="location">${data.name}, ${data.sys.country}</h1>
 <div class="weather__summary">
    <div>
    <p><i class="wi ${icons[data.weather[0].icon]} weather-icon"></i> <span class="weather__celsius-value">${Math.floor(data.main.temp)}°C</span></p>
    <p>${data.weather[0].main}</p>
    </div>
    <ul>
    <li><i class="wi wi-humidity"></i> Humidity  <span>${data.main.humidity}%</span></li>
    <li><i class="wi wi-small-craft-advisory"></i> Wind Speed <span>${data.wind.speed} m/s</span></li>
    </ul>
 </div>
 `;
            removeChildren(weather);
            weather.insertAdjacentHTML('beforeend', markup);
        })
        .catch((error) => {
            console.log(error);

        });
}
function getWeatherByCoordinates(latitude, longitude) {
    getCityWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=6ddc4e5be8a24a3ab00457fe9f1a37e1&units=metric`);
}
function getForecastByCoordinates(latitude, longitude) {
    getForecast(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=6ddc4e5be8a24a3ab00457fe9f1a37e1&units=metric`);
}
function getWeatherByCity(city) {
    getCityWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=6ddc4e5be8a24a3ab00457fe9f1a37e1&units=metric`);
}
function getForecastByCity(city) {
    getForecast(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=6ddc4e5be8a24a3ab00457fe9f1a37e1&units=metric`);
}

function geosuccess(position) {
    const { latitude, longitude } = position.coords;
    getWeatherByCoordinates(latitude, longitude);
    getForecastByCoordinates(latitude, longitude);
}

printTodayDate();
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    getWeatherByCity(cityInput.value);
    getForecastByCity(cityInput.value);
});


geolocateIcons.forEach((icon) => {
    icon.addEventListener('click', (e) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geosuccess);
        } else {
            alert('Your browser does not support geolocatio');
        }
    });
});