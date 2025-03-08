import express from 'express';
import crypto from 'crypto';
import User from '../models/User';
import Task from '../models/Task';
import { generateYearOfTasks } from '../utils/taskGenerator';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Sign up
router.post('/signup', async (req, res): Promise<any> => {
  try {
    const { name, email, password, seedData = true } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a random secret key for the user
    const secretKey = crypto.randomBytes(32).toString('hex');

    // Create new user
    const user = new User({
      name,
      email,
      password, // In a real app, you'd hash this
      secretKey,
    });

    await user.save();

    // Generate and save initial tasks for the new user if seedData is true
    if (seedData) {
      try {
        const yearOfTasks = generateYearOfTasks(user._id.toString());
        await Task.insertMany(yearOfTasks);
        console.log(`Generated ${yearOfTasks.length} initial tasks for new user ${user._id}`);
      } catch (error) {
        console.error('Error generating initial tasks:', error);
        // Don't fail the signup if task generation fails
      }
    }

    // Return the secret key to the client
    res.status(201).json({
      message: 'User created successfully',
      secretKey,
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Sign in
router.post('/signin', async (req, res): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    if (user.password !== password) { // In a real app, you'd compare hashed passwords
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Signed in successfully',
      secretKey: user.secretKey,
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Error in signin:', error);
    res.status(500).json({ message: 'Error signing in' });
  }
});

// Reseed sample data
router.post('/reseed', authMiddleware, async (req, res): Promise<any> => {
  try {
    const userId = req.user._id.toString();
    const yearOfTasks = generateYearOfTasks(userId);
    await Task.insertMany(yearOfTasks);
    
    console.log(`Generated ${yearOfTasks.length} sample tasks for user ${userId}`);
    res.json({ message: 'Sample tasks generated successfully' });
  } catch (error) {
    console.error('Error reseeding tasks:', error);
    res.status(500).json({ message: 'Error generating sample tasks' });
  }
});

export default router; 