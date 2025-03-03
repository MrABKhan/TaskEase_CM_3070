import { LocationData } from './locationService';
import Constants from 'expo-constants';

// Weather data interface
export interface WeatherData {
  icon: string;
  temp: string;
  condition: string;
  location?: string;
}

// OpenWeatherMap response interfaces
interface OpenWeatherResponse {
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

const API_KEY = Constants.expoConfig?.extra?.openWeatherMapApiKey;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Debug logger
const logWeather = {
  debug: (message: string, data?: any) => {
    console.log(`[WeatherService] ${message}`, data || '');
  },
  error: (message: string, error: any) => {
    console.log(`[WeatherService] Error - ${message}:`, {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
      details: error
    });
  }
};

// Convert temperature from Kelvin to Celsius
const kelvinToCelsius = (kelvin: number): number => {
  return Math.round(kelvin - 273.15);
};

// Map weather condition to emoji icon
const getWeatherEmoji = (condition: string, iconCode: string): string => {
  const timeOfDay = iconCode.endsWith('n') ? 'night' : 'day';
  
  switch (condition.toLowerCase()) {
    case 'clear':
      return timeOfDay === 'night' ? '🌙' : '☀️';
    case 'clouds':
      return iconCode === '02d' || iconCode === '02n' ? '⛅' : '☁️';
    case 'rain':
    case 'drizzle':
      return '🌧️';
    case 'thunderstorm':
      return '⛈️';
    case 'snow':
      return '❄️';
    case 'mist':
    case 'fog':
    case 'haze':
      return '🌫️';
    default:
      return '🌤️';
  }
};

export const getCurrentWeather = async (location: LocationData): Promise<WeatherData> => {
  try {
    logWeather.debug('Fetching weather data for location:', {
      latitude: location.latitude,
      longitude: location.longitude
    });

    const response = await fetch(
      `${BASE_URL}/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Weather API returned status: ${response.status}`);
    }

    const data: OpenWeatherResponse = await response.json();
    logWeather.debug('Weather data received:', data);

    const weatherData: WeatherData = {
      icon: getWeatherEmoji(data.weather[0].main, data.weather[0].icon),
      temp: `${kelvinToCelsius(data.main.temp)}°`,
      condition: data.weather[0].main,
      location: location.city && location.country 
        ? `${location.city}, ${location.country}`
        : data.name && data.sys.country 
          ? `${data.name}, ${data.sys.country}`
          : undefined
    };

    logWeather.debug('Processed weather data:', weatherData);
    return weatherData;
  } catch (error) {
    logWeather.error('Failed to fetch weather data', error);
    return {
      icon: '⚠️',
      temp: 'N/A',
      condition: 'Weather unavailable',
      location: location.city && location.country 
        ? `${location.city}, ${location.country}` 
        : undefined
    };
  }
}; 