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

describe('Admin User Management', () => {
  let adminToken: string;
  let userToken: string;
  let adminUser: any;
  let regularUser: any;

  beforeEach(async () => {
    adminUser = await User.create({
      username: 'adminuser',
      email: 'admin-mgmt@example.com',
      password: await bcrypt.hash('password123', 10),
      fullname: 'Admin Manager',
      role: 'admin',
    });
    adminToken = jwt.sign({ id: adminUser._id, email: adminUser.email, role: adminUser.role }, SECRET_KEY, { expiresIn: '1h' });

    regularUser = await User.create({
      username: 'regularuser',
      email: 'regular-mgmt@example.com',
      password: await bcrypt.hash('password123', 10),
      fullname: 'Regular User',
      role: 'user',
    });
    userToken = jwt.sign({ id: regularUser._id, email: regularUser.email, role: regularUser.role }, SECRET_KEY, { expiresIn: '1h' });
  });

  describe('GET /api/v1/admin/users', () => {
    it('should return paginated users for admin', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toBeInstanceOf(Array);
    });

    it('should return 403 for non-admin', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });

    it('should return 401 without auth', async () => {
      const res = await request(app).get('/api/v1/admin/users');
      expect(res.status).toBe(401);
    });

    it('should search users by name', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users?search=Admin')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/v1/admin/users/:id', () => {
    it('should return user by ID for admin', async () => {
      const res = await request(app)
        .get(`/api/v1/admin/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('regular-mgmt@example.com');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .get(`/api/v1/admin/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/v1/admin/users', () => {
    it('should create a user as admin', async () => {
      const res = await request(app)
        .post('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fullname: 'New Admin User',
          email: `admin-created-${Date.now()}@example.com`,
          password: 'password123',
          role: 'user',
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should return 400 for invalid data', async () => {
      const res = await request(app)
        .post('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: 'bad', password: '123' });
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/v1/admin/users/:id', () => {
    it('should update a user as admin', async () => {
      const res = await request(app)
        .put(`/api/v1/admin/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ fullname: 'Updated by Admin' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/api/v1/admin/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ fullname: 'Updated' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/admin/users/:id', () => {
    it('should delete a user as admin', async () => {
      const res = await request(app)
        .delete(`/api/v1/admin/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const found = await User.findById(regularUser._id);
      expect(found).toBeNull();
    });

    it('should return 400 when admin tries to delete themselves', async () => {
      const res = await request(app)
        .delete(`/api/v1/admin/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/cannot delete/i);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .delete(`/api/v1/admin/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/v1/auth/business-account', () => {
    it('should submit business account application', async () => {
      const res = await request(app)
        .post('/api/v1/auth/business-account')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ businessName: 'Test Business', registrationNo: 'REG123', businessType: 'Retailer' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 400 when business name is missing', async () => {
      const res = await request(app)
        .post('/api/v1/auth/business-account')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ registrationNo: 'REG123' });
      expect(res.status).toBe(400);
    });

    it('should return 401 without auth', async () => {
      const res = await request(app)
        .post('/api/v1/auth/business-account')
        .send({ businessName: 'Test', registrationNo: 'REG123' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/admin/users/business-accounts', () => {
    it('should return business accounts for admin', async () => {
      await User.findByIdAndUpdate(regularUser._id, {
        businessAccount: { status: 'pending', businessName: 'Test Biz', registrationNo: 'REG1', businessType: 'Retailer' },
      });
      const res = await request(app)
        .get('/api/v1/admin/users/business-accounts')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.data).toBeInstanceOf(Array);
    });

    it('should return 403 for non-admin', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users/business-accounts')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });
  });
});
