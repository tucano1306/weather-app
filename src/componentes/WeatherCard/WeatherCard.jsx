import { useState } from 'react';
import PropTypes from 'prop-types';
import useWeather from '../../hooks/useWeather';
import SearchBar from '../SearchBar/SearchBar';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import './WeatherCard.css';

const ErrorMessage = ({ message }) => (
  <div className="weather-error">
    <div className="error-content">
      <span className="error-icon">⚠️</span>
      <div className="error-message">
        {message.split('\n').map((line, index) => (
          <p key={index}>{line.trim()}</p>
        ))}
      </div>
    </div>
  </div>
);

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired
};

const WeatherCard = () => {
  const { weatherData, loading, error, fetchWeatherByCity } = useWeather();
  const [isCelsius, setIsCelsius] = useState(true);

  const getCountryName = (countryCode) => {
    const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });
    try {
      return regionNames.of(countryCode);
    } catch  {
      return countryCode;
    }
  };

  const isDayTime = () => {
    if (!weatherData) return true;
    const now = Date.now() / 1000;
    return now > weatherData.sys.sunrise && now < weatherData.sys.sunset;
  };

  const getBackgroundImage = () => {
    if (!weatherData) return 'clear.jpg';

    const weatherCode = weatherData.weather[0].id;
    const isDay = isDayTime();
    
    const weatherMap = {
      2: isDay ? 'tormenta.jpg' : 'tormenta-noche.jpg',
      3: isDay ? 'lluvia.jpg' : 'lluvia-noche.jpg',
      5: isDay ? 'lluvia.jpg' : 'lluvia-noche.jpg',
      6: isDay ? 'nieve.jpg' : 'nieve-noche.jpg',
      7: isDay ? 'nublado.jpg' : 'nublado-noche.jpg',
      800: isDay ? 'clear.jpg' : 'clear-night.jpg',
      8: isDay ? 'nublado.jpg' : 'nublado-noche.jpg',
    };

    if (weatherCode === 600) {
      return 'nevada-ligera.jpg';
    }

    const mainCode = weatherCode === 800 ? 800 : Math.floor(weatherCode / 100);
    return weatherMap[mainCode] || (isDay ? 'clear.jpg' : 'clear-night.jpg');
  };

  const getWeatherEmoji = (weatherCode) => {
    const code = String(weatherCode);

    switch (code[0]) {
      case '2': return '⛈️';
      case '3': return '🌦️';
      case '5': return '🌧️';
      case '6': return '❄️';
      case '7':
        switch (code) {
          case '701': return '🌫️';
          case '711': return '💨';
          case '721': return '🌫️';
          case '731': return '🌪️';
          case '741': return '🌫️';
          case '751': return '🌪️';
          case '761': return '🌫️';
          case '762': return '🌋';
          case '771': return '🌪️';
          case '781': return '🌪️';
          default: return '🌫️';
        }
      case '8':
        if (code === '800') return isDayTime() ? '☀️' : '🌙';
        if (code === '801') return '🌤️';
        if (code === '802') return '⛅';
        if (code === '803') return '🌥️';
        return '☁️';
      default:
        return '🌡️';
    }
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('es', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('es', { 
      weekday: 'short', 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric' 
    });
  };

  const convertTemp = (temp) => {
    if (!isCelsius) return (temp * 9/5) + 32;
    return temp;
  };

  const formatTemp = (temp) => {
    return `${Math.round(convertTemp(temp))}°${isCelsius ? 'C' : 'F'}`;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    let errorMessage = '';
    switch (error.toLowerCase()) {
      case 'no se pudo obtener tu ubicación':
        errorMessage = `No pudimos determinar tu ubicación actual. Por favor:
          1. Verifica que has permitido el acceso a la ubicación en tu navegador
          2. Asegúrate de que tu GPS esté activado (en dispositivos móviles)
          3. Intenta usar el buscador para encontrar tu ciudad y país`;
        break;
      case 'ciudad no encontrada':
        errorMessage = `No pudimos encontrar la ubicación. Por favor:
          1. Verifica que el nombre de la ciudad esté bien escrito
          2. Intenta agregar el país (ejemplo: "París, Francia")
          3. Prueba con una ciudad más grande cercana`;
        break;      
    }
    return <ErrorMessage message={errorMessage} />;
  }

  if (!weatherData) return null;

  const weatherEmoji = getWeatherEmoji(weatherData.weather[0].id);
  const backgroundImage = getBackgroundImage();

  return (
    <div 
      className="weather-app"
      style={{
        backgroundImage: `url(/backgrounds/${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease'
      }}
    >
      <div className="weather-overlay">
        <SearchBar onSearch={fetchWeatherByCity} />
        <div className="weather-card">
          <div className="weather-header">
            <div className="location">
              <h1>
                {weatherData.name}, {getCountryName(weatherData.sys.country)} 📍
              </h1>
              <button onClick={() => setIsCelsius(!isCelsius)} className="unit-toggle">
                {isCelsius ? '°C' : '°F'} 🌡️
              </button>
            </div>
            <div className="current-time">
              <div className="date">{formatDate()} 📅</div>
              <div className="time">{formatTime()} ⏰</div>
            </div>
          </div>

          <div className="current-weather">
            <div className="temperature">
              <h2>
                {formatTemp(weatherData.main.temp)} {weatherEmoji}
              </h2>
              <p className="weather-description">
                {weatherData.weather[0].description}
              </p>
            </div>
            
            <div className="weather-stats">
              <div className="stat">
                <span>Viento 💨</span>
                <p>{weatherData.wind.speed} km/h</p>
                <p>{weatherData.wind.deg}° {weatherData.wind.speed}km/h</p>
              </div>
              <div className="stat">
                <span>Temperatura 🌡️</span>
                <p>Máx: {formatTemp(weatherData.main.temp_max)} ⬆️</p>
                <p>Mín: {formatTemp(weatherData.main.temp_min)} ⬇️</p>
              </div>
              <div className="stat">
                <span>Nubes ☁️</span>
                <p>{weatherData.clouds.all}%</p>
                <p>Cobertura</p>
              </div>
              <div className="stat">
                <span>Presión 📊</span>
                <p>{weatherData.main.pressure} hPa</p>
                <p>Atmosférica</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;