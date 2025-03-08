import express from 'express';
import request from 'supertest';
import User from '../../models/User';
import Task from '../../models/Task';
import authRoutes from '../../routes/auth';
import { mockUser } from '../mocks/mockData';
import { generateYearOfTasks } from '../../utils/taskGenerator';
import { Request, Response, NextFunction } from 'express';

// Mock dependencies
jest.mock('../../models/User');
jest.mock('../../models/Task');
jest.mock('../../utils/taskGenerator');
jest.mock('../../middleware/auth', () => ({
  authMiddleware: (req: Request, res: Response, next: NextFunction) => {
    req.user = mockUser;
    next();
  },
}));

describe('Auth Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
  });

  describe('POST /signup', () => {
    it('should create a new user and return user data with secret key', async () => {
      // Mock User.findOne to return null (user doesn't exist)
      (User.findOne as jest.Mock).mockResolvedValue(null);
      
      // Mock User.prototype.save to return the mock user
      const mockSave = jest.fn().mockResolvedValue({
        ...mockUser,
        _id: mockUser._id,
      });
      
      // Mock User constructor
      (User as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        secretKey: mockUser.secretKey,
      }));
      
      // Mock generateYearOfTasks
      (generateYearOfTasks as jest.Mock).mockReturnValue([]);
      
      // Mock Task.insertMany
      (Task.insertMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'New User',
          email: 'new@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('secretKey');
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
      expect(User.findOne).toHaveBeenCalledWith({ email: 'new@example.com' });
      expect(mockSave).toHaveBeenCalled();
      expect(generateYearOfTasks).toHaveBeenCalled();
      expect(Task.insertMany).toHaveBeenCalled();
    });

    it('should return 400 if user already exists', async () => {
      // Mock User.findOne to return a user (user exists)
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Existing User',
          email: 'existing@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exists');
      expect(User.findOne).toHaveBeenCalledWith({ email: 'existing@example.com' });
    });
  });

  describe('POST /signin', () => {
    it('should sign in a user and return user data with secret key', async () => {
      // Mock User.findOne to return the mock user
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('secretKey', mockUser.secretKey);
      expect(response.body).toHaveProperty('userId', mockUser._id);
      expect(response.body).toHaveProperty('name', mockUser.name);
      expect(response.body).toHaveProperty('email', mockUser.email);
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should return 401 if user does not exist', async () => {
      // Mock User.findOne to return null (user doesn't exist)
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
      expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
    });

    it('should return 401 if password is incorrect', async () => {
      // Mock User.findOne to return the mock user
      (User.findOne as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: 'correct-password',
      });

      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'test@example.com',
          password: 'wrong-password',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

  describe('POST /reseed', () => {
    it('should generate and insert sample tasks', async () => {
      // Mock generateYearOfTasks
      const mockTasks = [{ title: 'Sample Task' }];
      (generateYearOfTasks as jest.Mock).mockReturnValue(mockTasks);
      
      // Mock Task.insertMany
      (Task.insertMany as jest.Mock).mockResolvedValue(mockTasks);

      const response = await request(app)
        .post('/api/auth/reseed')
        .set('x-secret-key', mockUser.secretKey);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Sample tasks generated successfully');
      expect(generateYearOfTasks).toHaveBeenCalledWith(mockUser._id);
      expect(Task.insertMany).toHaveBeenCalledWith(mockTasks);
    });
  });
}); 