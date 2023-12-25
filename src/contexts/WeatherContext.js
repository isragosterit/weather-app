import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const WeatherContext = createContext();

const WeatherContextProvider = (props) => {
  const apiKey = '0ae1a52deb32b071fb9399eb239ffa0d';
  const apiUrl = 'http://api.openweathermap.org/data/2.5/';

  const [weatherData, setWeatherData] = useState(null); // current weather data
  const [forecastData, setForecastData] = useState(null); // forecast weather data
  const [selectedCity, setSelectedCity] = useState('Istanbul'); // currently selected city
  const [cityList, setCityList] = useState([]); // list of cities

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchWeather = async () => {
          const weatherApiUrl = `${apiUrl}weather?q=${selectedCity}&appid=${apiKey}`;
          const weatherResponse = await axios.get(weatherApiUrl);
          setWeatherData(weatherResponse.data);
        };

        const fetchForecast = async () => {
          const forecastApiUrl = `${apiUrl}forecast?q=${selectedCity}&cnt=8&appid=${apiKey}`;
          const forecastResponse = await axios.get(forecastApiUrl);
          setForecastData(forecastResponse.data);
        };

        await Promise.all([fetchWeather(), fetchForecast()]);
      } catch (error) {
        console.error('error fetching weather data:', error);
      }
    };

    fetchData();
  }, [selectedCity, apiUrl, apiKey]);

  const changeCity = (city) => {
    setSelectedCity(city);
  };

  return (
    <WeatherContext.Provider value={{ weatherData, forecastData, cityList, changeCity }}>
      {props.children}
    </WeatherContext.Provider>
  );
};

export default WeatherContextProvider;