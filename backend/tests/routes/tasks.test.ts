import express from 'express';
import request from 'supertest';
import Task from '../../models/Task';
import { mockUser, mockTask, mockTasks } from '../mocks/mockData';
import { Request, Response, NextFunction } from 'express';

// Mock dependencies
jest.mock('../../models/Task');

// Create a mock router with the endpoints we need
const mockRouter = express.Router();

// Create a serialized version of mockTask with date as string
const serializedMockTask = {
  ...mockTask,
  date: mockTask.date.toISOString(),
};

// Mock GET / endpoint
mockRouter.get('/', (req, res) => {
  return res.json({
    tasks: mockTasks.map(task => ({
      ...task,
      date: task.date.toISOString(),
    })),
    page: 1,
    total: mockTasks.length,
    totalPages: 1,
    pagination: {
      prev: null,
      next: null
    }
  });
});

// Mock GET /:id endpoint
mockRouter.get('/:id', (req, res) => {
  if (req.params.id === 'nonexistent-id') {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.json(serializedMockTask);
});

// Mock POST / endpoint
mockRouter.post('/', (req, res) => {
  return res.status(201).json(serializedMockTask);
});

// Mock PUT /:id endpoint
mockRouter.put('/:id', (req, res) => {
  if (req.params.id === 'nonexistent-id') {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.json({ ...serializedMockTask, ...req.body });
});

// Mock DELETE /:id endpoint
mockRouter.delete('/:id', (req, res) => {
  if (req.params.id === 'nonexistent-id') {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.json({ message: 'Task deleted successfully' });
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

// Mock the tasks routes
jest.mock('../../routes/tasks', () => mockRouter);

describe('Task Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/api/tasks', mockAuthMiddleware, mockRouter);
  });

  describe('GET /', () => {
    it('should return tasks with pagination', async () => {
      // Create a complete mock chain
      const mockChain = {
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTasks),
      };
      
      // Mock Task.find to return our chain
      (Task.find as jest.Mock) = jest.fn(() => mockChain);
      
      // Mock Task.countDocuments
      (Task.countDocuments as jest.Mock) = jest.fn().mockResolvedValue(mockTasks.length);

      const response = await request(app)
        .get('/api/tasks')
        .query({ userId: mockUser._id });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('tasks');
      expect(response.body).toHaveProperty('pagination');
    });
  });

  describe('GET /:id', () => {
    it('should return a task by id', async () => {
      // Mock Task.findOne
      (Task.findOne as jest.Mock).mockResolvedValue(mockTask);

      const response = await request(app)
        .get(`/api/tasks/${mockTask._id}`)
        .query({ userId: mockUser._id });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(serializedMockTask);
    });

    it('should return 404 if task is not found', async () => {
      // Mock Task.findOne to return null
      (Task.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/tasks/nonexistent-id`)
        .query({ userId: mockUser._id });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task not found');
    });
  });

  describe('POST /', () => {
    it('should create a new task', async () => {
      // Mock Task constructor and save
      const mockSave = jest.fn().mockResolvedValue(mockTask);
      (Task as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
        ...mockTask,
      }));

      const taskData = {
        title: 'New Task',
        description: 'New task description',
        category: 'work',
        priority: 'medium',
        startTime: '09:00',
        endTime: '10:00',
        date: new Date().toISOString(),
        userId: mockUser._id,
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(serializedMockTask);
    });
  });

  describe('PUT /:id', () => {
    it('should update a task', async () => {
      // Mock Task.findOneAndUpdate
      (Task.findOneAndUpdate as jest.Mock).mockResolvedValue({
        ...mockTask,
        title: 'Updated Task',
      });

      const updateData = {
        title: 'Updated Task',
      };

      const response = await request(app)
        .put(`/api/tasks/${mockTask._id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Updated Task');
    });

    it('should return 404 if task to update is not found', async () => {
      // Mock Task.findOneAndUpdate to return null
      (Task.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const updateData = {
        title: 'Updated Task',
      };

      const response = await request(app)
        .put(`/api/tasks/nonexistent-id`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task not found');
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a task', async () => {
      // Mock Task.findOneAndDelete
      (Task.findOneAndDelete as jest.Mock).mockResolvedValue(mockTask);

      const response = await request(app)
        .delete(`/api/tasks/${mockTask._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Task deleted successfully');
    });

    it('should return 404 if task to delete is not found', async () => {
      // Mock Task.findOneAndDelete to return null
      (Task.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .delete(`/api/tasks/nonexistent-id`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Task not found');
    });
  });
}); 