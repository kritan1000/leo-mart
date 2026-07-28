import request from 'supertest';
import app from '../../app';
import User from '../../models/user_model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../config/constant';
import { connectTestDB, disconnectTestDB, clearCollections } from '../helpers';

jest.mock('../../utils/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
  passwordResetEmailTemplate: jest.fn().mockReturnValue('<html></html>'),
}));

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await clearCollections();
});

describe('GET /api/v1/auth/whoami', () => {
  let testUser: any;
  let validToken: string;

  beforeEach(async () => {
    testUser = await User.create({
      username: 'whoamiuser',
      email: 'whoami@example.com',
      password: await bcrypt.hash('password123', 10),
      fullname: 'Who Am I User',
      role: 'user',
    });
    validToken = jwt.sign(
      { id: testUser._id, email: testUser.email, role: testUser.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
  });

  it('should return 200 with user data for valid JWT', async () => {
    const res = await request(app)
      .get('/api/v1/auth/whoami')
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.email).toBe(testUser.email);
  });

  it('should return 401 for invalid JWT', async () => {
    const res = await request(app)
      .get('/api/v1/auth/whoami')
      .set('Authorization', 'Bearer invalid-token-here');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 when JWT is missing', async () => {
    const res = await request(app)
      .get('/api/v1/auth/whoami');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
