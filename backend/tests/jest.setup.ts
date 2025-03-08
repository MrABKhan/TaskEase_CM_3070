import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Mock mongoose methods instead of using a real database
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');
  
  return {
    ...originalModule,
    connect: jest.fn().mockResolvedValue(true),
    connection: {
      readyState: 1,
      collections: {},
    },
    disconnect: jest.fn().mockResolvedValue(true),
  };
});

// Setup before tests
beforeAll(async () => {
  // Nothing to do here since we're mocking mongoose
});

// Clean up after tests
afterAll(async () => {
  // Nothing to do here since we're mocking mongoose
});

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
}); 