import { authMiddleware, optionalAuthMiddleware } from '../../middleware/auth.middleware';
import { adminMiddleware } from '../../middleware/admin.middleware';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../config/constant';

describe('Auth Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('authMiddleware', () => {
    it('should call next with valid token', () => {
      const token = jwt.sign({ id: 'user1', email: 'test@example.com', role: 'user' }, SECRET_KEY, { expiresIn: '1h' });
      mockReq.headers.authorization = `Bearer ${token}`;
      authMiddleware(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
    });

    it('should return 401 when no token is provided', () => {
      authMiddleware(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token format', () => {
      mockReq.headers.authorization = 'Bearer invalid-token';
      authMiddleware(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 when authorization header does not start with Bearer', () => {
      mockReq.headers.authorization = 'Basic abc123';
      authMiddleware(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 for expired token', () => {
      const token = jwt.sign({ id: 'user1' }, SECRET_KEY, { expiresIn: '0s' });
      mockReq.headers.authorization = `Bearer ${token}`;
      authMiddleware(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  describe('optionalAuthMiddleware', () => {
    it('should call next and set user for valid token', () => {
      const token = jwt.sign({ id: 'user1', email: 'test@example.com', role: 'user' }, SECRET_KEY, { expiresIn: '1h' });
      mockReq.headers.authorization = `Bearer ${token}`;
      optionalAuthMiddleware(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
    });

    it('should call next without user when no token', () => {
      optionalAuthMiddleware(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
    });

    it('should call next without user for invalid token', () => {
      mockReq.headers.authorization = 'Bearer invalid-token';
      optionalAuthMiddleware(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
    });
  });
});

describe('Admin Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should call next when user is admin', () => {
    mockReq = { user: { role: 'admin' } };
    adminMiddleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 401 when user is not set', () => {
    mockReq = {};
    adminMiddleware(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  it('should return 403 when user is not admin', () => {
    mockReq = { user: { role: 'user' } };
    adminMiddleware(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(403);
  });
});
