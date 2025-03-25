import React, { useState, useEffect } from 'react';

function Weather({ location }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${location}`
        );
        
        if (!response.ok) {
          throw new Error('Weather data not available');
        }
        
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetch(
            `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${position.coords.latitude},${position.coords.longitude}`
          )
            .then(response => response.json())
            .then(data => {
              setWeather(data);
              setLocation(data.location.name);
            });
        },
        (error) => {
          setError("Could not detect your location");
        }
      );
    }
  }, []);

  useEffect(() => {
    if (weather?.current.condition.text.toLowerCase().includes('rain')) {
      alert("Remember to add 'Take umbrella' to your tasks!");
    }
  }, [weather]);

  if (loading) return <div className="weather-loading">Loading weather...</div>;
  if (error) return <div className="weather-error">Error: {error}</div>;
  if (!weather) return null;

  return (
    <div className="weather-card">
      <h3>Weather in {weather.location.name}</h3>
      <div className="weather-content">
        <div className="weather-main">
          <img 
            src={`https:${weather.current.condition.icon}`} 
            alt={weather.current.condition.text}
          />
          <span>{weather.current.temp_c}°C</span>
        </div>
        <div className="weather-details">
          <p>{weather.current.condition.text}</p>
          <p>Humidity: {weather.current.humidity}%</p>
          <p>Wind: {weather.current.wind_kph} km/h</p>
        </div>
      </div>
    </div>
  );
}

export default Weather;