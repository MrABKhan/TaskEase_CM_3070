import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks';
import analyticsRoutes from './routes/analytics';
import authRoutes from './routes/auth';
import { authMiddleware } from './middleware/auth';
import Task from './models/Task';
import { generateYearOfTasks } from './utils/taskGenerator';
import User from './models/User';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Protected routes
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);

// Seed data function
const createTestUser = async () => {
  try {
    // Create or find a test user
    const testUser = await User.findOneAndUpdate(
      { email: 'test@testmail.com' },
      {
        name: 'Test User',
        email: 'test@testmail.com',
        password: 'test123456', // In a real app, this would be hashed
        secretKey: crypto.randomBytes(32).toString('hex')
      },
      { upsert: true, new: true }
    );
    
    console.log(`Test user created/updated successfully with ID: ${testUser._id}`);
  } catch (error) {
    console.error('Error creating test user:', error);
  }
};

// MongoDB connection with seeding
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Create test user on server start
    await createTestUser();
  })
  .catch((error) => console.error('MongoDB connection error:', error));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 