import express from 'express';
import { calculateActivityMetrics, calculateWellnessMetrics } from '../services/analyticsService';

const router = express.Router();

// Get activity analytics for the user
router.get('/activity', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const activityMetrics = await calculateActivityMetrics(userId as string);
    return res.json(activityMetrics);
  } catch (error) {
    console.error('Error fetching activity analytics:', error);
    return res.status(500).json({ message: 'Error fetching activity analytics', error });
  }
});

// Get wellness metrics for the user
router.get('/wellness', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const wellnessMetrics = await calculateWellnessMetrics(userId as string);
    return res.json(wellnessMetrics);
  } catch (error) {
    console.error('Error fetching wellness metrics:', error);
    return res.status(500).json({ message: 'Error fetching wellness metrics', error });
  }
});

export default router; 