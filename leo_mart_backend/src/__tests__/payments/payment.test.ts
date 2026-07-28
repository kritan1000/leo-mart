import request from 'supertest';
import app from '../../app';
import Product from '../../models/product_model';
import User from '../../models/user_model';
import Order from '../../models/order_model';
import PendingPayment from '../../models/pending_payment_model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../config/constant';
import { connectTestDB, disconnectTestDB, clearCollections } from '../helpers';

jest.mock('../../utils/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
  passwordResetEmailTemplate: jest.fn().mockReturnValue('<html></html>'),
}));

jest.mock('../../services/khalti_service', () => ({
  KhaltiService: jest.fn().mockImplementation(() => ({
    initiatePayment: jest.fn().mockResolvedValue({
      success: true,
      payment_url: 'https://khalti.com/pay/test',
      pidx: 'test-pidx-123',
      purchaseOrderId: 'ORD-KHALTI-TEST',
    }),
    verifyPayment: jest.fn().mockResolvedValue({
      success: true,
      message: 'Payment verified',
      order: {
        pidx: 'test-pidx-123',
        paymentStatus: 'Paid',
        transactionId: 'txn-123',
        totalAmount: 600,
        purchaseOrderId: 'ORD-KHALTI-TEST',
      },
    }),
  })),
}));

beforeAll(async () => { await connectTestDB(); });
afterAll(async () => { await disconnectTestDB(); });
afterEach(async () => { await clearCollections(); });

describe('Payment API', () => {
  let authToken: string;
  let testUser: any;
  let testProduct: any;

  beforeEach(async () => {
    testUser = await User.create({
      username: 'payuser',
      email: 'pay@example.com',
      password: await bcrypt.hash('password123', 10),
      fullname: 'Pay User',
      role: 'user',
    });
    authToken = jwt.sign({ id: testUser._id, email: testUser.email, role: testUser.role }, SECRET_KEY, { expiresIn: '1h' });

    testProduct = await Product.create({
      name: 'Payment Product', description: 'Product for payment testing', price: 500,
      category: 'Test', brand: 'TestBrand', stockStatus: 'in-stock', image: '/uploads/pay-product.jpg',
    });
  });

  describe('POST /api/v1/payment/khalti/initiate', () => {
    it('should initiate Khalti payment with valid data', async () => {
      const res = await request(app)
        .post('/api/v1/payment/khalti/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customerInfo: { fullname: 'John Doe', email: 'john@example.com', phone: '9800000000' },
          shippingAddress: { street: '123 Main St', city: 'Kathmandu', district: 'Kathmandu' },
          items: [{ productId: testProduct._id.toString(), quantity: 1 }],
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.payment_url).toBeDefined();
    });

    it('should return 400 when customer info is missing', async () => {
      const res = await request(app)
        .post('/api/v1/payment/khalti/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          shippingAddress: { street: '123 Main St', city: 'Kathmandu', district: 'Kathmandu' },
          items: [{ productId: testProduct._id.toString(), quantity: 1 }],
        });
      expect(res.status).toBe(400);
    });

    it('should return 400 when shipping address is incomplete', async () => {
      const res = await request(app)
        .post('/api/v1/payment/khalti/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customerInfo: { fullname: 'John Doe', email: 'john@example.com', phone: '9800000000' },
          shippingAddress: { street: '123 Main St' },
          items: [{ productId: testProduct._id.toString(), quantity: 1 }],
        });
      expect(res.status).toBe(400);
    });

    it('should return 400 when items are empty', async () => {
      const res = await request(app)
        .post('/api/v1/payment/khalti/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customerInfo: { fullname: 'John Doe', email: 'john@example.com', phone: '9800000000' },
          shippingAddress: { street: '123 Main St', city: 'Kathmandu', district: 'Kathmandu' },
          items: [],
        });
      expect(res.status).toBe(400);
    });

    it('should work without auth (optional auth)', async () => {
      const res = await request(app)
        .post('/api/v1/payment/khalti/initiate')
        .send({
          customerInfo: { fullname: 'John Doe', email: 'john@example.com', phone: '9800000000' },
          shippingAddress: { street: '123 Main St', city: 'Kathmandu', district: 'Kathmandu' },
          items: [{ productId: testProduct._id.toString(), quantity: 1 }],
        });
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/v1/payment/khalti/verify', () => {
    it('should verify Khalti payment with valid pidx', async () => {
      const res = await request(app)
        .post('/api/v1/payment/khalti/verify')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ pidx: 'test-pidx-123' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 400 when pidx is missing', async () => {
      const res = await request(app)
        .post('/api/v1/payment/khalti/verify')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/pidx/i);
    });
  });
});
