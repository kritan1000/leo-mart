import request from 'supertest';
import app from '../../app';
import User from '../../models/user_model';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
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

describe('POST /api/v1/auth/reset-password/:token', () => {
  it('should return 200 for valid token and new password', async () => {
    const rawToken = 'test-reset-token-12345';
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    await User.create({
      username: 'resetpwuser',
      email: 'reset-pw@example.com',
      password: await bcrypt.hash('oldpassword', 10),
      fullname: 'Reset PW User',
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000),
    });

    const res = await request(app)
      .post(`/api/v1/auth/reset-password/${rawToken}`)
      .send({ newPassword: 'newpassword123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/password has been reset/i);
  });

  it('should return 400 for invalid token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password/invalid-token-xyz')
      .send({ newPassword: 'newpassword123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 when newPassword is missing', async () => {
    const rawToken = 'token-without-new-pw';
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    await User.create({
      username: 'nopwuser',
      email: 'no-pw@example.com',
      password: await bcrypt.hash('oldpassword', 10),
      fullname: 'No PW User',
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000),
    });

    const res = await request(app)
      .post(`/api/v1/auth/reset-password/${rawToken}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for expired token', async () => {
    const expiredRawToken = 'expired-token-99999';
    const hashedExpired = crypto.createHash('sha256').update(expiredRawToken).digest('hex');

    await User.create({
      username: 'expiredpwuser',
      email: 'expired@example.com',
      password: await bcrypt.hash('oldpassword', 10),
      fullname: 'Expired PW User',
      passwordResetToken: hashedExpired,
      passwordResetExpires: new Date(Date.now() - 60 * 60 * 1000),
    });

    const res = await request(app)
      .post(`/api/v1/auth/reset-password/${expiredRawToken}`)
      .send({ newPassword: 'newpassword123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
