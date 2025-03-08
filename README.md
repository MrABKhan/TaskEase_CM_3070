# TaskEase

TaskEase is an AI-powered task management application that revolutionizes personal productivity through intelligent personalization. Built with React Native (Expo) for the frontend and Node.js/Express/MongoDB for the backend, TaskEase offers smart task scheduling, context-aware recommendations, and seamless integration with various third-party services.

## Features

- 🧠 **Smart Task Input**: Natural language processing for effortless task creation
- 🤖 **AI-Powered Scheduling**: Automatic task prioritization based on urgency and importance
- 🎯 **Focus Mode**: Adaptive Pomodoro timer with smart break suggestions
- 📊 **Analytics Dashboard**: Comprehensive productivity insights and metrics
- 📝 **Smart Task Templates**: Reusable task sequences with sharing capabilities
- 🔄 **Seamless Integrations**: Calendar sync, email integration, and third-party app connections
- 🎮 **Gamification Elements**: Achievement badges and progress tracking
- 🧘 **Mental Health Considerations**: Break reminders and stress level assessments

## Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Docker](https://www.docker.com/products/docker-desktop/) (optional, for containerized development)
- [Expo Go](https://expo.dev/client) app on your mobile device (for mobile development)

## Getting Started

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Expo development server:
   ```bash
   npx expo start
   ```

3. Open the app:
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator
   - Press 'w' for web browser

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   PORT=3000
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   docker compose up --build -d
   ```

### Docker Setup (Alternative)

You can also run the backend using Docker:

1. Build and start the containers:
   ```bash
   cd backend
   npm run docker:up
   ```

2. Stop the containers:
   ```bash
   npm run docker:down
   ```

3. Rebuild and start (after changes):
   ```bash
   npm run docker:rebuild
   ```

## Project Structure

```
taskease/
├── app/                   # React Native Expo frontend
│   ├── components/       # Reusable UI components
│   ├── screens/         # Screen components
│   ├── services/        # API and utility services
│   └── navigation/      # Navigation configuration
├── backend/              # Node.js/Express backend
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── config/          # Configuration files
└── docs/                # Documentation
```


## API Configuration

### Environment Setup

The application supports three environments:
- Development (local development)
- Staging (internal testing)
- Production (live deployment)

### Local Development

1. Start the backend server locally:
   ```bash
   cd backend
   docker compose up --build -d 
   ```

2. The frontend will automatically use these API URLs in development:
   - Android Emulator: `http://10.0.2.2:3000/api`
   - iOS Simulator/Web: `http://localhost:3000/api`

### Preview/Staging Deployment

Please note currently all preview and internal applications are deployed to a 
backend hosted on aws, and are pointing to it.


1. Configure your staging API URL in `eas.json`:
   ```json
   {
     "build": {
       "preview": {
         "env": {
           "EXPO_PUBLIC_API_URL": "http://your-staging-api-url.com/api",
           "EXPO_PUBLIC_ENV": "staging"
         }
       }
     }
   }
   ```

2. Build the preview version:
   ```bash
   eas build --profile preview --platform all
   ```

### Production Deployment

1. Configure your production API URL in `eas.json`:
   ```json
   {
     "build": {
       "production": {
         "env": {
           "EXPO_PUBLIC_API_URL": "http://your-production-api-url.com/api",
           "EXPO_PUBLIC_ENV": "production"
         }
       }
     }
   }
   ```

2. Build the production version:
   ```bash
   eas build --profile production --platform all
   ```

### Environment Variables

The following environment variables are used for API configuration:

- `EXPO_PUBLIC_API_URL`: The base URL for the API endpoints
- `EXPO_PUBLIC_ENV`: The current environment ('development', 'staging', or 'production')

### Using Custom API URLs

You can override the API URL for any environment by:

1. Creating a `.env` file in the root directory:
   ```
   EXPO_PUBLIC_API_URL=http://your-custom-api-url.com/api
   EXPO_PUBLIC_ENV=development
   ```

2. Or using the EAS secret command:
   ```bash
   eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "http://your-custom-api-url.com/api" --type string
   ```

### Verifying API Configuration

To verify the current API configuration:

1. In development, check the console logs for:
   ```
   🌐 Running in [environment] environment with API URL: [url]
   ```

2. In the app, navigate to Settings > About to view the current API endpoint.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Task Manager Mobile App Template
- React Native Expo community
- MongoDB and Express.js communities
- All contributors and supporters


## Deployment

### Internal Preview Deployment (Expo)

To share a preview version of the app with your team for testing:

1. Install EAS CLI if you haven't already:
   ```bash
   npm install -g eas-cli
   ```

2. Login to your Expo account:
   ```bash
   eas login
   ```

3. Configure your project for EAS Build (if not already done):
   ```bash
   eas build:configure
   ```

4. The project includes an `eas.json` file with the following build profiles:

   - **Development**: Includes development client features for debugging
   - **Preview**: For internal team testing via TestFlight and APK downloads
   - **Production**: For app store submissions

5. To build for different purposes:

   - **For Internal Team Testing** (preview builds):
     ```bash
     eas build --profile preview --platform all
     ```

   - **For Development Builds** (with development client features):
     ```bash
     eas build --profile development --platform all
     ```

   - **For Production Builds** (when ready for app stores):
     ```bash
     eas build --profile production --platform all
     ```

6. Once the builds are complete, you can share them with your team:
   - For iOS: EAS will generate a link that you can share with your team members (they'll need to have the Apple TestFlight app installed)
   - For Android: EAS will provide a direct download link for the APK

7. Your team members can install the app by:
   - iOS: Opening the TestFlight invitation and installing the app
   - Android: Downloading and installing the APK directly

8. For subsequent updates, you can create new builds with the same command:
   ```bash
   eas build --profile preview --platform all
   ```

9. Before building, make sure to update the API URLs in `eas.json` to point to your deployed backend:
   ```json
   "env": {
     "API_URL": "https://your-actual-api-url.com"
   }
   ```

Note: Make sure your team members have an Expo account and are added to your project as collaborators if you're using the free tier of Expo.

### Frontend Deployment (Expo)

The frontend can be deployed using Expo Application Services (EAS):

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login to your Expo account:
   ```bash
   eas login
   ```

3. Configure EAS Build:
   ```bash
   eas build:configure
   ```

4. Create a build:
   - For Android:
     ```bash
     eas build --platform android
     ```
   - For iOS:
     ```bash
     eas build --platform ios
     ```

5. Submit to stores:
   ```bash
   eas submit
   ```

Note: This project cannot be deployed as an Expo Snack due to its complex architecture and backend dependencies.
