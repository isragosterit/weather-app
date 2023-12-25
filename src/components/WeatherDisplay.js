import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { WeatherContext } from '../contexts/WeatherContext';

function WeatherDisplay() {
  const { changeCity } = useContext(WeatherContext);
  const [localCityList, setLocalCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [weeklyForecast, setWeeklyForecast] = useState([]);

  // get the URL for weather icon based on icon code
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // round temperature to the nearest 0.5 value
  const roundTemperature = (temperature) => {
    const roundedTemp = Math.round(temperature * 2) / 2;
    return roundedTemp >= 2.5 ? Math.ceil(roundedTemp) : Math.floor(roundedTemp);
  };

  // fetch city list on component mount
  useEffect(() => {
    const fetchCityList = async () => {
      try {
        const response = await axios.get('https://gist.githubusercontent.com/ozdemirburak/4821a26db048cc0972c1beee48a408de/raw/4754e5f9d09dade2e6c461d7e960e13ef38eaa88/cities_of_turkey.json');
        const cities = response.data.map((cityData) => cityData.name);
        setLocalCityList(cities);

        if (cities.length > 0) {
          setSelectedCity(cities[0]);
          await getWeeklyForecast(cities[0]);
        }
      } catch (error) {
        console.error('error fetching city list:', error);
      }
    };
    fetchCityList();
  }, []);

  // get weekly weather forecast for a city
  const getWeeklyForecast = async (city) => {
    try {
      const apiKey = '0ae1a52deb32b071fb9399eb239ffa0d';
      const apiUrl = 'http://api.openweathermap.org/data/2.5/';
      const response = await axios.get(`${apiUrl}forecast?q=${city}&units=metric&cnt=40&appid=${apiKey}`);
  
      const currentDate = new Date();
      const localOffset = currentDate.getTimezoneOffset() * 60;
  
      const forecasts = response.data.list.reduce((dailyForecasts, forecast) => {
        const forecastDate = new Date((forecast.dt + localOffset) * 1000).toLocaleDateString('en-US');
        const existingForecast = dailyForecasts[forecastDate];
  
        if (!existingForecast || forecast.dt < existingForecast.dt) {
          dailyForecasts[forecastDate] = forecast;
        }
  
        return dailyForecasts;
      }, {});
  
      const uniqueForecasts = Object.values(forecasts).filter((forecast) => forecast);
      const nextDaysForecast = uniqueForecasts.slice(0, 6);
  
      const currentIndex = nextDaysForecast.findIndex((forecast) => {
        const forecastDate = new Date((forecast.dt + localOffset) * 1000).toLocaleDateString('en-US');
        return forecastDate === currentDate.toLocaleDateString('en-US');
      });
  
      setWeeklyForecast(nextDaysForecast.slice(currentIndex));
    } catch (error) {
      console.error('error fetching weekly forecast:', error);
    }
  };

  // format date to display weekday
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <div className='container'>
      <select
        value={selectedCity}
        onChange={async (e) => {
          const city = e.target.value;
          setSelectedCity(city);
          setWeeklyForecast([]);
          await getWeeklyForecast(city);
          changeCity(city);
        }}
      >
        {localCityList.map((city, index) => (
          <option key={index} value={city}>
            {city}
          </option>
        ))}
      </select>
      {weeklyForecast.map((forecast, index) => (
        <div key={index} className='days'>
          <h3>{formatDate(forecast.dt_txt)}</h3>
          <h1>{roundTemperature(forecast.main.temp)}°C</h1>
          {forecast.weather.map((weather, idx) => (
            <img
              key={idx}
              src={getWeatherIconUrl(weather.icon)}
              alt={weather.description}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default WeatherDisplay;