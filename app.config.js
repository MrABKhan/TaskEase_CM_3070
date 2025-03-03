module.exports = {
  expo: {
    name: 'TaskEase',
    slug: 'TaskEase',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.bakarkhan.TaskEase'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      },
      package: 'com.bakarkhan.TaskEase'
    },
    web: {
      favicon: './assets/images/favicon.png'
    },
    extra: {
      openWeatherMapApiKey: process.env.OPENWEATHERMAP_API_KEY,
    }
  }
}; 