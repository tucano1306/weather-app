export const getWeatherBackground = (weatherCode) => {
    const backgrounds = {
      // Thunderstorm
      2: 'linear-gradient(to bottom right, #1a1a1a, #4a4a4a)',
      // Drizzle
      3: 'linear-gradient(to bottom right, #4a4a6a, #7a7a9a)',
      // Rain
      5: 'linear-gradient(to bottom right, #2c3e50, #3498db)',
      // Snow
      6: 'linear-gradient(to bottom right, #bdc3c7, #ecf0f1)',
      // Atmosphere (mist, fog, etc)
      7: 'linear-gradient(to bottom right, #636e72, #b2bec3)',
      // Clear
      800: 'linear-gradient(to bottom right, #00b4db, #0083b0)',
      // Clouds
      8: 'linear-gradient(to bottom right, #57606f, #747d8c)',
      // Default
      default: 'linear-gradient(to bottom right, #00b4db, #0083b0)'
    };
  
    if (weatherCode === 800) return backgrounds[800];
    
    const mainCode = Math.floor(weatherCode / 100);
    return backgrounds[mainCode] || backgrounds.default;
  };
  
  
  export const getTextColor = (weatherCode) => {
    const darkBackgrounds = [2, 5]; 
    const mainCode = Math.floor(weatherCode / 100);
    
    return darkBackgrounds.includes(mainCode) ? '#ffffff' : '#333333';
  };