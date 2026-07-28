import request from 'supertest';
import app from '../../app';
import { connectTestDB, disconnectTestDB, clearCollections } from '../helpers';

jest.mock('../../utils/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
  passwordResetEmailTemplate: jest.fn().mockReturnValue('<html></html>'),
}));

beforeAll(async () => { await connectTestDB(); });
afterAll(async () => { await disconnectTestDB(); });
afterEach(async () => { await clearCollections(); });

describe('App Global Handlers', () => {
  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/v1/nonexistent');
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });

    it('should return 404 for unknown POST routes', async () => {
      const res = await request(app).post('/api/v1/unknown-endpoint').send({});
      expect(res.status).toBe(404);
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const res = await request(app)
        .options('/api/v1/auth/login')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST');
      expect(res.status).toBe(200);
    });
  });

  describe('Health check via existing route', () => {
    it('should respond to GET /api/v1/products', async () => {
      const res = await request(app).get('/api/v1/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
