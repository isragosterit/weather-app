import React from 'react';
import './App.css'
import WeatherContextProvider from './contexts/WeatherContext';
import WeatherDisplay from './components/WeatherDisplay';

function App() {
  return (
    <WeatherContextProvider>
      <WeatherDisplay />
    </WeatherContextProvider>
  );
}

export default App;
