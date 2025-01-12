import PropTypes from 'prop-types';
import './LoadingScreen.css';

const LoadingScreen = ({ message = 'Cargando información del clima...' }) => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-icon">
          {}
          <div className="weather-icons">
            <span>🌤️</span>
            <span>🌦️</span>
            <span>⛈️</span>
            <span>❄️</span>
          </div>
          {}
          <div className="loading-spinner"></div>
        </div>
        <p className="loading-message">{message}</p>
        <p className="loading-tip">
          Obteniendo datos del clima en tiempo real...
        </p>
      </div>
    </div>
  );
};

LoadingScreen.propTypes = {
  message: PropTypes.string
};

export default LoadingScreen;