import express from 'express';
import Task, { ITask } from '../models/Task';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

const router = express.Router();

// Get all tasks with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      userId,
      category,
      priority,
      completed,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'asc'
    } = req.query;

    const query: any = { userId };

    // Apply filters
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (completed !== undefined) query.completed = completed === 'true';
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

// Get tasks for today
router.get('/today', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const today = new Date();
    const tasks = await Task.find({
      userId: userId as string,
      date: {
        $gte: startOfDay(today),
        $lte: endOfDay(today)
      }
    }).sort({ startTime: 1 });

    console.log('Fetched today\'s tasks:', {
      userId,
      count: tasks.length,
      date: today
    });

    return res.json(tasks);
  } catch (error) {
    console.error('Error fetching today\'s tasks:', error);
    return res.status(500).json({ message: 'Error fetching today\'s tasks', error });
  }
});

// Get tasks for specific date
router.get('/date/:date', async (req, res) => {
  try {
    const { userId } = req.query;
    const date = new Date(req.params.date);
    
    const tasks = await Task.find({
      userId,
      date: {
        $gte: startOfDay(date),
        $lte: endOfDay(date)
      }
    }).sort({ startTime: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks for date', error });
  }
});

// Get tasks for specific month
router.get('/month/:year/:month', async (req, res) => {
  try {
    const { userId } = req.query;
    const { year, month } = req.params;
    const date = new Date(Number(year), Number(month) - 1);
    
    const tasks = await Task.find({
      userId,
      date: {
        $gte: startOfMonth(date),
        $lte: endOfMonth(date)
      }
    }).sort({ date: 1, startTime: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks for month', error });
  }
});

// Get single task with details
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching task details', error });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      date: new Date(req.body.date)
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    if (updates.date) {
      updates.date = new Date(updates.date);
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.json(updatedTask);
  } catch (error) {
    return res.status(400).json({ message: 'Error updating task', error });
  }
});

// Update subtask
router.patch('/:id/subtasks/:subtaskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const subtask = task.subtasks.find(st => st.id === req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: 'Subtask not found' });
    }

    Object.assign(subtask, req.body);
    await task.save();

    return res.json(task);
  } catch (error) {
    return res.status(400).json({ message: 'Error updating subtask', error });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Error deleting task', error });
  }
});

export default router; 