import PropTypes from 'prop-types';
import './ForecastSection.css';

const ForecastSection = ({ forecast, isCelsius }) => {
  if (!forecast) return null;

  const convertTemp = (temp) => {
    if (!isCelsius) {
      return (temp * 9/5) + 32;
    }
    return temp;
  };

  const formatTemp = (temp) => {
    return `${Math.round(convertTemp(temp))}°`;
  };

  const formatDate = (dt) => {
    const date = new Date(dt * 1000);
    return date.toLocaleDateString('es', { weekday: 'short', day: 'numeric' });
  };

  return (
    <div className="forecast-section">
      <h3>Pronóstico para los próximos días</h3>
      <div className="forecast-container">
        {forecast.daily.slice(1, 6).map((day) => (
          <div key={day.dt} className="forecast-day">
            <p className="forecast-date">{formatDate(day.dt)}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
              className="forecast-icon"
            />
            <div className="forecast-temps">
              <span className="max-temp">{formatTemp(day.temp.max)}</span>
              <span className="min-temp">{formatTemp(day.temp.min)}</span>
            </div>
            <p className="forecast-desc">{day.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

ForecastSection.propTypes = {
  forecast: PropTypes.shape({
    daily: PropTypes.arrayOf(PropTypes.shape({
      dt: PropTypes.number.isRequired,
      temp: PropTypes.shape({
        max: PropTypes.number.isRequired,
        min: PropTypes.number.isRequired
      }).isRequired,
      weather: PropTypes.arrayOf(PropTypes.shape({
        description: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired
      })).isRequired
    })).isRequired
  }),
  isCelsius: PropTypes.bool
};

ForecastSection.defaultProps = {
  isCelsius: true
};

export default ForecastSection;