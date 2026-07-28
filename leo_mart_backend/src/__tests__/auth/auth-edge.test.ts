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

beforeAll(async () => { await connectTestDB(); });
afterAll(async () => { await disconnectTestDB(); });
afterEach(async () => { await clearCollections(); });

describe('Auth Edge Cases', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should auto-generate username from email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `autouser-${Date.now()}@example.com`,
          password: 'password123',
          confirmPassword: 'password123',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.username).toBeDefined();
    });

    it('should return 400 when username already exists', async () => {
      await User.create({
        username: 'takenname',
        email: 'taken@example.com',
        password: await bcrypt.hash('password123', 10),
        fullname: 'Taken Name',
      });
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'takenname',
          email: `new-${Date.now()}@example.com`,
          password: 'password123',
          confirmPassword: 'password123',
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/username/i);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should set token cookie on successful login', async () => {
      const email = `cookie-test-${Date.now()}@example.com`;
      await User.create({
        username: 'cookieuser',
        email,
        password: await bcrypt.hash('password123', 10),
        fullname: 'Cookie User',
      });
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email, password: 'password123' });
      expect(res.status).toBe(200);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should return user data in response', async () => {
      const email = `userdata-${Date.now()}@example.com`;
      await User.create({
        username: 'datauser',
        email,
        password: await bcrypt.hash('password123', 10),
        fullname: 'Data User',
      });
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email, password: 'password123' });
      expect(res.body.data.user.email).toBe(email);
      expect(res.body.data.token).toBeDefined();
    });
  });

  describe('PUT /api/v1/auth/update', () => {
    it('should update password with hashing', async () => {
      const user = await User.create({
        username: 'pwupdate',
        email: `pwupdate-${Date.now()}@example.com`,
        password: await bcrypt.hash('oldpass123', 10),
        fullname: 'PW Update User',
      });
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
      const res = await request(app)
        .put('/api/v1/auth/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ password: 'newpass123' });
      expect(res.status).toBe(200);

      // Verify new password works
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: 'newpass123' });
      expect(loginRes.status).toBe(200);
    });
  });

  describe('POST /api/v1/auth/request-password-reset', () => {
    it('should return 400 when email is not provided', async () => {
      const res = await request(app)
        .post('/api/v1/auth/request-password-reset')
        .send({});
      expect(res.status).toBe(400);
    });

    it('should return 400 when email is not a string', async () => {
      const res = await request(app)
        .post('/api/v1/auth/request-password-reset')
        .send({ email: 12345 });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/reset-password/:token', () => {
    it('should return 400 for password shorter than 6 chars', async () => {
      const res = await request(app)
        .post('/api/v1/auth/reset-password/some-token')
        .send({ newPassword: '12345' });
      expect(res.status).toBe(400);
    });
  });
});
