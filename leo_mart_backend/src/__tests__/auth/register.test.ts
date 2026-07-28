import request from 'supertest';
import app from '../../app';
import User from '../../models/user_model';
import bcrypt from 'bcryptjs';
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

describe('POST /api/v1/auth/register', () => {
  const validUser = {
    fullname: 'Test User',
    email: 'test-register@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  };

  it('should return 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for invalid email format', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 when passwords do not match', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, confirmPassword: 'different123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for weak password (less than 6 chars)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, password: '12345', confirmPassword: '12345' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 when email already exists', async () => {
    await User.create({
      username: 'existinguser',
      email: validUser.email,
      password: await bcrypt.hash('password123', 10),
      fullname: 'Existing User',
    });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(validUser);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should return 201 for successful registration', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, email: `success-${Date.now()}@example.com` });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/registered successfully/i);
    expect(res.body.data).toBeDefined();
  });
});
