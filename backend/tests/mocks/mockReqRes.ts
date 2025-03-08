import { Request, Response } from 'express';
import { mockUser } from './mockData';

// Mock Request
export const mockRequest = (overrides = {}) => {
  const req: Partial<Request> = {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: mockUser,
    ...overrides,
  };
  return req as Request;
};

// Mock Response
export const mockResponse = () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
  return res as Response;
};

// Mock Next Function
export const mockNext = jest.fn(); 