import request from 'supertest';
import app from '../../app';
import Quotation from '../../models/quotation_model';
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

describe('Quotation API', () => {
  let adminToken: string;

  beforeEach(async () => {
    const admin = await User.create({
      username: 'adminquote',
      email: 'admin-quote@example.com',
      password: await bcrypt.hash('password123', 10),
      fullname: 'Admin Quote',
      role: 'admin',
    });
    adminToken = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, SECRET_KEY, { expiresIn: '1h' });
  });

  describe('POST /api/v1/quotations', () => {
    it('should create a quotation request', async () => {
      const res = await request(app)
        .post('/api/v1/quotations')
        .send({ companyName: 'Test Corp', email: 'test@corp.com', phone: '9800000000', items: '10x Widget A, 5x Gadget B' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should return 400 for invalid quotation data', async () => {
      const res = await request(app)
        .post('/api/v1/quotations')
        .send({ companyName: '', email: 'not-email', phone: '', items: '' });
      expect(res.status).toBe(400);
    });

    it('should return 400 when company name is too short', async () => {
      const res = await request(app)
        .post('/api/v1/quotations')
        .send({ companyName: 'A', email: 'test@corp.com', phone: '9800000000', items: 'Some items' });
      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid email format', async () => {
      const res = await request(app)
        .post('/api/v1/quotations')
        .send({ companyName: 'Test Corp', email: 'bad-email', phone: '9800000000', items: 'Some items' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/quotations', () => {
    it('should return quotations for admin', async () => {
      await Quotation.create({ companyName: 'Corp A', email: 'a@corp.com', phone: '9800000001', items: 'Widget' });
      const res = await request(app)
        .get('/api/v1/quotations')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.data).toBeInstanceOf(Array);
    });

    it('should return 401 without auth', async () => {
      const res = await request(app).get('/api/v1/quotations');
      expect(res.status).toBe(401);
    });

    it('should paginate quotations', async () => {
      for (let i = 0; i < 5; i++) {
        await Quotation.create({ companyName: `Corp ${i}`, email: `${i}@corp.com`, phone: '9800000000', items: `Item ${i}` });
      }
      const res = await request(app)
        .get('/api/v1/quotations?page=1&size=2')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.data.length).toBe(2);
    });
  });

  describe('PUT /api/v1/quotations/:id', () => {
    it('should update quotation status as admin', async () => {
      const q = await Quotation.create({ companyName: 'Corp X', email: 'x@corp.com', phone: '9800000000', items: 'Widget' });
      const res = await request(app)
        .put(`/api/v1/quotations/${q._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'reviewed' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('reviewed');
    });

    it('should return 400 for invalid status', async () => {
      const q = await Quotation.create({ companyName: 'Corp Y', email: 'y@corp.com', phone: '9800000000', items: 'Widget' });
      const res = await request(app)
        .put(`/api/v1/quotations/${q._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'invalid-status' });
      expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent quotation', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/api/v1/quotations/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'completed' });
      expect(res.status).toBe(404);
    });
  });
});
