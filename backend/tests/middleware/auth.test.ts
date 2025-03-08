import { authMiddleware } from '../../middleware/auth';
import User from '../../models/User';
import { mockRequest, mockResponse, mockNext } from '../mocks/mockReqRes';
import { mockUser } from '../mocks/mockData';

jest.mock('../../models/User');

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() when a valid secret key is provided', async () => {
    // Mock User.findOne to return a user
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const req = mockRequest({
      headers: { 'x-secret-key': 'valid-secret-key' },
      user: undefined,
    });
    const res = mockResponse();
    const next = mockNext;

    await authMiddleware(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ secretKey: 'valid-secret-key' });
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 401 when no secret key is provided', async () => {
    const req = mockRequest({
      headers: {},
      user: undefined,
    });
    const res = mockResponse();
    const next = mockNext;

    await authMiddleware(req, res, next);

    expect(User.findOne).not.toHaveBeenCalled();
    expect(req.user).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No authentication token provided' });
  });

  it('should return 401 when an invalid secret key is provided', async () => {
    // Mock User.findOne to return null (no user found)
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const req = mockRequest({
      headers: { 'x-secret-key': 'invalid-secret-key' },
      user: undefined,
    });
    const res = mockResponse();
    const next = mockNext;

    await authMiddleware(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ secretKey: 'invalid-secret-key' });
    expect(req.user).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid authentication token' });
  });

  it('should return 500 when an error occurs', async () => {
    // Mock User.findOne to throw an error
    (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = mockRequest({
      headers: { 'x-secret-key': 'valid-secret-key' },
      user: undefined,
    });
    const res = mockResponse();
    const next = mockNext;

    await authMiddleware(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ secretKey: 'valid-secret-key' });
    expect(req.user).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
  });
}); 