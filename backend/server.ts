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
const seedDatabase = async () => {
  try {
    // Clear existing tasks
    await Task.deleteMany({});
    
    // Generate and insert a year of tasks
    const yearOfTasks = generateYearOfTasks();
    await Task.insertMany(yearOfTasks);
    
    console.log(`Database seeded successfully with ${yearOfTasks.length} tasks`);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// MongoDB connection with seeding
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Seed the database on every server start
    await seedDatabase();
  })
  .catch((error) => console.error('MongoDB connection error:', error));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 