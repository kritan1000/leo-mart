import request from 'supertest';
import app from '../../app';
import User from '../../models/user_model';
import bcrypt from 'bcryptjs';
import { connectTestDB, disconnectTestDB, clearCollections } from '../helpers';

const mockSendEmail = jest.fn().mockResolvedValue(undefined);
jest.mock('../../utils/email', () => ({
  sendEmail: (...args: any[]) => mockSendEmail(...args),
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
  mockSendEmail.mockClear();
});

describe('POST /api/v1/auth/request-password-reset', () => {
  const testEmail = 'reset-request@example.com';

  beforeEach(async () => {
    await User.create({
      username: 'resetrequser',
      email: testEmail,
      password: await bcrypt.hash('password123', 10),
      fullname: 'Reset Request User',
    });
  });

  it('should return 200 for existing email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/request-password-reset')
      .send({ email: testEmail });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/password reset link sent/i);
    expect(mockSendEmail).toHaveBeenCalled();
  });

  it('should return 404 for unknown email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/request-password-reset')
      .send({ email: 'unknown@example.com' });
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
