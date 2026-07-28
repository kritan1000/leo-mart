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

describe('PUT /api/v1/auth/update', () => {
  let testUser: any;
  let validToken: string;

  beforeEach(async () => {
    testUser = await User.create({
      username: 'updateuser',
      email: 'update@example.com',
      password: await bcrypt.hash('password123', 10),
      fullname: 'Update User',
      role: 'user',
    });
    validToken = jwt.sign(
      { id: testUser._id, email: testUser.email, role: testUser.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
  });

  it('should return 200 for authorized profile update', async () => {
    const res = await request(app)
      .put('/api/v1/auth/update')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ fullname: 'Updated Name' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/profile updated/i);
  });

  it('should return 401 for unauthorized request', async () => {
    const res = await request(app)
      .put('/api/v1/auth/update')
      .send({ fullname: 'No Auth' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 200 when updating with valid email', async () => {
    const newEmail = `updated-${Date.now()}@example.com`;
    const res = await request(app)
      .put('/api/v1/auth/update')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ email: newEmail });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
