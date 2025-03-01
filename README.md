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
   npm run dev
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

## API Documentation

The backend API includes the following main endpoints:

- `GET /api/tasks`: Get all tasks with filtering and pagination
- `GET /api/tasks/:id`: Get a single task by ID
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/:id`: Update an existing task
- `DELETE /api/tasks/:id`: Delete a task

For detailed API documentation, run the backend server and visit:
```
http://localhost:3000/api-docs
```

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

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Deployment

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

### Backend Deployment

The backend can be deployed to any Node.js hosting service:

1. Popular hosting options:
   - Heroku
   - DigitalOcean
   - AWS Elastic Beanstalk
   - Google Cloud Platform
   - Microsoft Azure

2. MongoDB hosting:
   - MongoDB Atlas (recommended)
   - Self-hosted MongoDB

3. Environment setup:
   ```bash
   # Set these environment variables on your hosting platform
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   NODE_ENV=production
   ```
