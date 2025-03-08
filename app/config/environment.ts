import { Platform } from 'react-native';

type Environment = 'development' | 'staging' | 'production';

interface Config {
  API_URL: string;
}

// Get environment from EAS build config or default to development
const ENV = (process.env.EXPO_PUBLIC_ENV as Environment) || 'development';

const getDefaultApiUrl = () => {
  return process.env.EXPO_PUBLIC_API_URL || Platform.select({
    android: 'http://10.0.2.2:3000/api',
    default: 'http://localhost:3000/api',
  });
};

const configs: Record<Environment, Config> = {
  development: {
    API_URL: getDefaultApiUrl(),
  },
  staging: {
    API_URL: 'http://173.212.241.12:3000/api',
  },
  production: {
    API_URL:  'http://173.212.241.12:3000/api',
  },
};

const config = configs[ENV];

console.log(`🌐 Running in ${ENV} environment with API URL: ${config.API_URL}`);

export default config; 