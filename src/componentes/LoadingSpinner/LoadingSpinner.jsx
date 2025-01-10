import PropTypes from 'prop-types';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Cargando información del clima...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-inner"></div>
      </div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string
};

export default LoadingSpinner;