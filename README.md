# TaskEase

TaskEase is an AI-powered task management application that revolutionizes personal productivity through intelligent personalization. Built with React Native (Expo) for the frontend and Node.js/Express/MongoDB for the backend, TaskEase offers smart task scheduling, context-aware recommendations, and seamless integration with various third-party services.

---

## Table of Contents

- [TaskEase](#taskease)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Quick Start: Local Setup](#quick-start-local-setup)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
  - [Detailed Configuration](#detailed-configuration)
    - [EAS Build Configuration](#eas-build-configuration)
      - [Local Development with EAS](#local-development-with-eas)
      - [Staging/Preview \& Production](#stagingpreview--production)
      - [Important Note](#important-note)
        - [Verifying API Configuration](#verifying-api-configuration)
    - [EAS Deployment \& Build](#eas-deployment--build)
      - [Expo Deployment Steps](#expo-deployment-steps)
  - [System Logs](#system-logs)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)

---


## Features

- **Smart Task Input** 🧠: Natural language processing for effortless task creation.
- **AI-Powered Scheduling** 🤖: Automatic task prioritization based on urgency and importance.
- **Focus/Break Mode** 🎯: Adaptive Pomodoro timer with smart break suggestions.
- **Analytics Dashboard** 📊: Comprehensive productivity insights and metrics.
- **Smart Task Templates** 📝: Reusable task sequences with sharing capabilities.
- **Mental Health Considerations** 🧘: Break reminders and stress level assessments.

---

## Prerequisites

Before getting started, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (included with Node.js)
- [Docker](https://www.docker.com/products/docker-desktop/) (optional, for containerized development)
- [Expo Go](https://expo.dev/client) (for mobile development)

---

## Quick Start: Local Setup

The following instructions are designed to get you up and running locally as fast as possible.

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the backend directory with the following contents:
   ```env
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the backend server:**
   ```bash
   docker compose up --build -d
   ```

---

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure the API URL:**
   In your `.env` file, choose the appropriate `EXPO_PUBLIC_API_URL` by uncommenting the line for your target platform:
   ```env
   # Uncomment Below For IOS Local Development 
   #EXPO_PUBLIC_API_URL=http://localhost:3000/api

   # Uncomment Below For Android Local Development 
   #EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api

   # Uncomment Below For Staging 
   #EXPO_PUBLIC_API_URL=http://173.212.241.12:3000/api

   # Uncomment Below For Production 
   #EXPO_PUBLIC_API_URL=http://173.212.241.12:3000/api
   ```

3. **Start the Expo development server (platform independent):**
   ```bash
   npx expo start
   ```

4. **Launch the App:**
   - **Mobile Device:** Scan the QR code with Expo Go (Android) or the Camera app (iOS).
   - **Emulators/Simulators:** 
     - Press `a` for Android emulator.
     - Press `i` for iOS simulator.
     - Press `w` for web browser.

5. **For Native Development Builds (Optional):**
   - **Android:**
     ```bash
     npx expo run:android
     ```
   - **iOS:**
     ```bash
     npx expo run:ios
     ```

*By following these steps, you can quickly test and interact with TaskEase locally on your development machine.*

---

## Detailed Configuration

For more comprehensive testing and deployment scenarios, refer to the sections below.

### EAS Build Configuration

TaskEase supports building using Expo Application Services (EAS) for live updates, critical bug fixes, and beta features.

TaskEase offers three EAS build environments:

- **Development:** For local development.
- **Staging/Preview:** For internal testing.
- **Production:** For live deployment.

#### Local Development with EAS

1. **Ensure the backend is running locally:**
   ```bash
   cd backend
   docker compose up --build -d
   ```
2. **Configure your `.env` as in the Frontend Setup section.**

#### Staging/Preview & Production

Configure the API URL and environment in your `eas.json` file accordingly:

- **For Staging/Preview:**
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

- **For Production:**
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

#### Important Note

For EAS builds, note that the currently deployed backend AWS server is at `http://173.212.241.12:3000/api`. You can use this endpoint if desired.

##### Verifying API Configuration

- **In Development:** Look for console logs indicating the current environment and API URL.
  ```
  🌐 Running in [environment] environment with API URL: [url]
  ```
- **In the App:** Navigate to **Settings > About** to view the active API endpoint.

---

### EAS Deployment & Build

TaskEase uses EAS for both internal and production builds.

#### Expo Deployment Steps

1. **Install EAS CLI (if not already installed):**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to your Expo account:**
   ```bash
   eas login
   ```

3. **Configure EAS Build:**
   ```bash
   eas build:configure
   ```

4. **Build Profiles in `eas.json`:**
   - **Development:** For debugging.
   - **Preview (Internal Testing):** For TestFlight (iOS) or APK (Android).
   - **Production:** For app store submissions.

5. **Build Commands:**
   - **Internal Testing:**
     ```bash
     eas build --profile preview --platform all
     ```
   - **Production:**
     ```bash
     eas build --profile production --platform all
     ```

6. **Submission:**
   After a successful production build, submit your app:
   ```bash
   eas submit
   ```

---


## System Logs

For viewing logs on your device for preview EAS builds, use the following commands:

```bash
npx react-native log-android
npx react-native log-ios
```

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- Task Manager Mobile App Template
- React Native Expo community
- MongoDB and Express.js communities
- All contributors and supporters
