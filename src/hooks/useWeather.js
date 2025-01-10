import { useState, useEffect, useCallback } from 'react';

const API_KEY = '2b96064480e5316677a4656f30637c76';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = useCallback(async (lat, lon) => {
    try {
      setLoading(true);
      
      // Obtener datos del clima actual
      const response = await fetch(
        `${WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
      );

      if (!response.ok) throw new Error('Error al obtener datos del clima');

      const data = await response.json();
      setWeatherData(data);

      // Obtener pronóstico
      const forecastResponse = await fetch(
        `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
      );

      if (!forecastResponse.ok) throw new Error('Error al obtener el pronóstico');

      const forecastData = await forecastResponse.json();
      const dailyForecasts = forecastData.list.reduce((acc, forecast) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = {
            dt: forecast.dt,
            temp: {
              max: forecast.main.temp_max,
              min: forecast.main.temp_min
            },
            weather: forecast.weather
          };
        }
        return acc;
      }, {});

      setForecastData({
        daily: Object.values(dailyForecasts).slice(0, 5)
      });
      setError(null);
    } catch {
      setError('Error al obtener datos del clima');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Éxito en obtener ubicación
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        // Error al obtener ubicación
        () => {
          setError('No se pudo acceder a tu ubicación. Por favor, permite el acceso a la ubicación en tu navegador.');
          setLoading(false);
        },
        // Opciones de geolocalización
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setError('Tu navegador no soporta geolocalización');
      setLoading(false);
    }
  }, [fetchWeatherData]);

  const fetchWeatherByCity = async (cityName) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${WEATHER_URL}?q=${cityName}&appid=${API_KEY}&units=metric&lang=es`
      );

      if (!response.ok) throw new Error('Ciudad no encontrada');

      const data = await response.json();
      setWeatherData(data);
      await fetchWeatherData(data.coord.lat, data.coord.lon);
    } catch {
      setError('Ciudad no encontrada');
      setLoading(false);
    }
  };

  return {
    weatherData,
    forecastData,
    loading,
    error,
    fetchWeatherByCity
  };
};

export default useWeather;