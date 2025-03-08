module.exports = {
  expo: {
    name: 'TaskEase',
    slug: 'TaskEase',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "TaskEase needs your location to provide weather updates and location-based task suggestions.",
        NSLocationAlwaysAndWhenInUseUsageDescription: "TaskEase needs your location to provide weather updates and location-based task suggestions.",
        NSMicrophoneUsageDescription: "TaskEase needs access to your microphone for voice input features.",
        NSSpeechRecognitionUsageDescription: "TaskEase needs access to speech recognition for voice input features.",
        ITSAppUsesNonExemptEncryption: false,
        UIBackgroundModes: ["remote-notification"]
      },
      bundleIdentifier: 'com.bakarkhan.TaskEase'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.FOREGROUND_SERVICE_LOCATION",
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.SCHEDULE_EXACT_ALARM",
        "android.permission.POST_NOTIFICATIONS"
      ],
      package: 'com.bakarkhan.TaskEase'
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow TaskEase to use your location to provide weather updates and location-based task suggestions.",
          "locationWhenInUsePermission": "Allow TaskEase to use your location while the app is in use.",
          "isAndroidBackgroundLocationEnabled": true,
          "isAndroidForegroundServiceEnabled": true
        }
      ],
      "expo-font",
      "expo-dev-client",
      [
        "expo-speech-recognition",
        {
          "microphonePermission": "Allow TaskEase to use the microphone.",
          "speechRecognitionPermission": "Allow TaskEase to use speech recognition.",
          "androidSpeechServicePackages": ["com.google.android.googlequicksearchbox"]
        }
      ],
      [
        "expo-notifications",
        {
          "icon": "./assets/images/adaptive-icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/sounds/notification.wav"]
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "1186facd-c721-4645-ae2c-e0de94aefcdb"
      },
      openWeatherMapApiKey: process.env.OPENWEATHERMAP_API_KEY,
    }
  }
}; 