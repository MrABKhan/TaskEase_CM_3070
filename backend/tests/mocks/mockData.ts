import mongoose from 'mongoose';

// Define interfaces with optional _id
interface MockUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  secretKey: string;
}

interface MockTask {
  _id?: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  startTime: string;
  endTime: string;
  date: Date;
  completed: boolean;
  notes: string[];
  subtasks: Array<{id: string, title: string, completed: boolean}>;
  tags: string[];
  userId: string;
}

// Generate a user ID that will be used consistently
const userId = new mongoose.Types.ObjectId().toString();

// Mock User Data
export const mockUser: MockUser = {
  _id: userId,
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  secretKey: 'test-secret-key-12345',
};

// Mock Task Data
export const mockTask: MockTask = {
  _id: new mongoose.Types.ObjectId().toString(),
  title: 'Test Task',
  description: 'This is a test task',
  category: 'work',
  priority: 'medium',
  startTime: '09:00',
  endTime: '10:00',
  date: new Date('2023-01-01'),
  completed: false,
  notes: ['Note 1', 'Note 2'],
  subtasks: [
    {
      id: 'subtask-1',
      title: 'Subtask 1',
      completed: false,
    },
  ],
  tags: ['test', 'important'],
  userId: userId,
};

// Mock Tasks List
export const mockTasks: MockTask[] = [
  mockTask,
  {
    _id: new mongoose.Types.ObjectId().toString(),
    title: 'Test Task 2',
    description: 'This is another test task',
    category: 'health',
    priority: 'high',
    startTime: '11:00',
    endTime: '12:00',
    date: new Date('2023-01-02'),
    completed: true,
    notes: [],
    subtasks: [],
    tags: ['health'],
    userId: userId,
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    title: 'Test Task 3',
    description: 'This is yet another test task',
    category: 'study',
    priority: 'low',
    startTime: '13:00',
    endTime: '14:00',
    date: new Date('2023-01-03'),
    completed: false,
    notes: ['Study note'],
    subtasks: [],
    tags: ['study', 'important'],
    userId: userId,
  },
]; 