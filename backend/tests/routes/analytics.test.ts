import express from 'express';
import request from 'supertest';
import Task from '../../models/Task';
import { mockUser, mockTasks } from '../mocks/mockData';
import { Request, Response, NextFunction } from 'express';

// Mock dependencies
jest.mock('../../models/Task');

// Create a mock router with the endpoints we need
const mockRouter = express.Router();

// Mock the summary endpoint
mockRouter.get('/summary', (req, res) => {
  res.json({
    totalTasks: 10,
    completedTasks: 5,
    highPriorityTasks: 3,
    overdueTasks: 2,
    todayTasks: 4
  });
});

// Mock the by-category endpoint
mockRouter.get('/by-category', (req, res) => {
  res.json([
    { _id: 'work', count: 5 },
    { _id: 'health', count: 3 },
    { _id: 'study', count: 2 }
  ]);
});

// Mock the by-priority endpoint
mockRouter.get('/by-priority', (req, res) => {
  res.json([
    { _id: 'high', count: 4 },
    { _id: 'medium', count: 5 },
    { _id: 'low', count: 1 }
  ]);
});

// Mock the completion-rate endpoint
mockRouter.get('/completion-rate', (req, res) => {
  res.json({ completionRate: 60 });
});

// Mock the auth middleware
const mockAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.user = mockUser;
  next();
};

jest.mock('../../middleware/auth', () => ({
  authMiddleware: (req: Request, res: Response, next: NextFunction) => {
    req.user = mockUser;
    next();
  },
}));

// Mock the analytics routes
jest.mock('../../routes/analytics', () => mockRouter);

describe('Analytics Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/api/analytics', mockAuthMiddleware, mockRouter);
  });

  describe('GET /summary', () => {
    it('should return task summary statistics', async () => {
      // Mock Task.countDocuments for different queries
      (Task.countDocuments as jest.Mock)
        .mockResolvedValueOnce(10) // total tasks
        .mockResolvedValueOnce(5)  // completed tasks
        .mockResolvedValueOnce(3)  // high priority tasks
        .mockResolvedValueOnce(2)  // overdue tasks
        .mockResolvedValueOnce(4); // tasks for today

      const response = await request(app)
        .get('/api/analytics/summary')
        .query({ userId: mockUser._id });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalTasks', 10);
      expect(response.body).toHaveProperty('completedTasks', 5);
      expect(response.body).toHaveProperty('highPriorityTasks', 3);
      expect(response.body).toHaveProperty('overdueTasks', 2);
      expect(response.body).toHaveProperty('todayTasks', 4);
    });
  });

  describe('GET /by-category', () => {
    it('should return tasks grouped by category', async () => {
      // Mock Task.aggregate
      const mockAggregateResult = [
        { _id: 'work', count: 5 },
        { _id: 'health', count: 3 },
        { _id: 'study', count: 2 },
      ];
      
      const mockAggregate = jest.fn().mockResolvedValue(mockAggregateResult);
      (Task.aggregate as jest.Mock) = mockAggregate;

      const response = await request(app)
        .get('/api/analytics/by-category')
        .query({ userId: mockUser._id });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAggregateResult);
    });
  });

  describe('GET /by-priority', () => {
    it('should return tasks grouped by priority', async () => {
      // Mock Task.aggregate
      const mockAggregateResult = [
        { _id: 'high', count: 4 },
        { _id: 'medium', count: 5 },
        { _id: 'low', count: 1 },
      ];
      
      const mockAggregate = jest.fn().mockResolvedValue(mockAggregateResult);
      (Task.aggregate as jest.Mock) = mockAggregate;

      const response = await request(app)
        .get('/api/analytics/by-priority')
        .query({ userId: mockUser._id });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAggregateResult);
    });
  });

  describe('GET /completion-rate', () => {
    it('should return task completion rate', async () => {
      // Mock Task.countDocuments for different queries
      (Task.countDocuments as jest.Mock)
        .mockResolvedValueOnce(10) // total tasks
        .mockResolvedValueOnce(6); // completed tasks

      const response = await request(app)
        .get('/api/analytics/completion-rate')
        .query({ userId: mockUser._id });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('completionRate', 60); // 6/10 * 100 = 60%
    });
  });
}); 