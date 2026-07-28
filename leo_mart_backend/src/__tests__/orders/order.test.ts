import request from 'supertest';
import app from '../../app';
import Order from '../../models/order_model';
import Product from '../../models/product_model';
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

describe('Order API', () => {
  let authToken: string;
  let adminToken: string;
  let testUser: any;
  let testProduct: any;

  const validCustomerInfo = { fullname: 'John Doe', email: 'john@example.com', phone: '9800000000' };
  const validShippingAddress = { street: '123 Main St', city: 'Kathmandu', district: 'Kathmandu' };

  beforeEach(async () => {
    testUser = await User.create({
      username: 'orderuser',
      email: 'order@example.com',
      password: await bcrypt.hash('password123', 10),
      fullname: 'Order User',
      role: 'user',
    });
    authToken = jwt.sign({ id: testUser._id, email: testUser.email, role: testUser.role }, SECRET_KEY, { expiresIn: '1h' });

    const admin = await User.create({
      username: 'adminorder',
      email: 'admin-order@example.com',
      password: await bcrypt.hash('password123', 10),
      fullname: 'Admin Order',
      role: 'admin',
    });
    adminToken = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, SECRET_KEY, { expiresIn: '1h' });

    testProduct = await Product.create({
      name: 'Order Product', description: 'Product for order testing', price: 500,
      category: 'Test', brand: 'TestBrand', stockStatus: 'in-stock', image: '/uploads/order-product.jpg',
    });
  });

  describe('POST /api/v1/orders/cod', () => {
    it('should create a COD order with valid data', async () => {
      const res = await request(app)
        .post('/api/v1/orders/cod')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customerInfo: validCustomerInfo,
          shippingAddress: validShippingAddress,
          items: [{ productId: testProduct._id.toString(), quantity: 2 }],
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.order.paymentMethod).toBe('Cash on Delivery');
    });

    it('should return 400 when customer info is missing', async () => {
      const res = await request(app)
        .post('/api/v1/orders/cod')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ shippingAddress: validShippingAddress, items: [{ productId: testProduct._id.toString(), quantity: 1 }] });
      expect(res.status).toBe(400);
    });

    it('should return 400 when shipping address is incomplete', async () => {
      const res = await request(app)
        .post('/api/v1/orders/cod')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ customerInfo: validCustomerInfo, shippingAddress: { street: '123 Main St' }, items: [{ productId: testProduct._id.toString(), quantity: 1 }] });
      expect(res.status).toBe(400);
    });

    it('should return 400 when items are empty', async () => {
      const res = await request(app)
        .post('/api/v1/orders/cod')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ customerInfo: validCustomerInfo, shippingAddress: validShippingAddress, items: [] });
      expect(res.status).toBe(400);
    });

    it('should calculate correct total with delivery charge', async () => {
      const res = await request(app)
        .post('/api/v1/orders/cod')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customerInfo: validCustomerInfo,
          shippingAddress: validShippingAddress,
          items: [{ productId: testProduct._id.toString(), quantity: 1 }],
        });
      expect(res.status).toBe(201);
      expect(res.body.order.totalAmount).toBe(600);
      expect(res.body.order.subtotal).toBe(500);
      expect(res.body.order.deliveryCharge).toBe(100);
    });

    it('should work without auth (guest order)', async () => {
      const res = await request(app)
        .post('/api/v1/orders/cod')
        .send({
          customerInfo: validCustomerInfo,
          shippingAddress: validShippingAddress,
          items: [{ productId: testProduct._id.toString(), quantity: 1 }],
        });
      expect(res.status).toBe(201);
    });
  });

  describe('GET /api/v1/orders/:id', () => {
    it('should return an order by ID', async () => {
      const order = await Order.create({
        user: testUser._id, customerInfo: validCustomerInfo, shippingAddress: validShippingAddress,
        items: [{ productId: testProduct._id, name: 'Order Product', price: 500, quantity: 1 }],
        subtotal: 500, deliveryCharge: 100, discount: 0, totalAmount: 600,
        paymentMethod: 'Cash on Delivery', paymentStatus: 'Pending', orderStatus: 'Pending',
      });
      const res = await request(app).get(`/api/v1/orders/${order._id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 for non-existent order', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/v1/orders/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/v1/orders/user', () => {
    it('should return orders for authenticated user', async () => {
      await Order.create({
        user: testUser._id, customerInfo: validCustomerInfo, shippingAddress: validShippingAddress,
        items: [{ productId: testProduct._id, name: 'Order Product', price: 500, quantity: 1 }],
        subtotal: 500, deliveryCharge: 100, discount: 0, totalAmount: 600,
        paymentMethod: 'Cash on Delivery', paymentStatus: 'Pending', orderStatus: 'Pending',
      });
      const res = await request(app)
        .get('/api/v1/orders/user')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app).get('/api/v1/orders/user');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/orders/admin/all', () => {
    it('should return all orders for admin', async () => {
      await Order.create({
        user: testUser._id, customerInfo: validCustomerInfo, shippingAddress: validShippingAddress,
        items: [{ productId: testProduct._id, name: 'Order Product', price: 500, quantity: 1 }],
        subtotal: 500, deliveryCharge: 100, discount: 0, totalAmount: 600,
        paymentMethod: 'Cash on Delivery', paymentStatus: 'Pending', orderStatus: 'Pending',
      });
      const res = await request(app)
        .get('/api/v1/orders/admin/all')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should allow authenticated non-admin user (route uses auth only)', async () => {
      const res = await request(app)
        .get('/api/v1/orders/admin/all')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
    });
  });

  describe('PATCH /api/v1/orders/admin/:id/status', () => {
    it('should update order status as admin', async () => {
      const order = await Order.create({
        user: testUser._id, customerInfo: validCustomerInfo, shippingAddress: validShippingAddress,
        items: [{ productId: testProduct._id, name: 'Order Product', price: 500, quantity: 1 }],
        subtotal: 500, deliveryCharge: 100, discount: 0, totalAmount: 600,
        paymentMethod: 'Cash on Delivery', paymentStatus: 'Pending', orderStatus: 'Pending',
      });
      const res = await request(app)
        .patch(`/api/v1/orders/admin/${order._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ orderStatus: 'Processing' });
      expect(res.status).toBe(200);
      expect(res.body.order.orderStatus).toBe('Processing');
    });

    it('should return 400 when orderStatus is missing', async () => {
      const order = await Order.create({
        user: testUser._id, customerInfo: validCustomerInfo, shippingAddress: validShippingAddress,
        items: [{ productId: testProduct._id, name: 'Order Product', price: 500, quantity: 1 }],
        subtotal: 500, deliveryCharge: 100, discount: 0, totalAmount: 600,
        paymentMethod: 'Cash on Delivery', paymentStatus: 'Pending', orderStatus: 'Pending',
      });
      const res = await request(app)
        .patch(`/api/v1/orders/admin/${order._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid order status', async () => {
      const order = await Order.create({
        user: testUser._id, customerInfo: validCustomerInfo, shippingAddress: validShippingAddress,
        items: [{ productId: testProduct._id, name: 'Order Product', price: 500, quantity: 1 }],
        subtotal: 500, deliveryCharge: 100, discount: 0, totalAmount: 600,
        paymentMethod: 'Cash on Delivery', paymentStatus: 'Pending', orderStatus: 'Pending',
      });
      const res = await request(app)
        .patch(`/api/v1/orders/admin/${order._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ orderStatus: 'InvalidStatus' });
      expect(res.status).toBe(400);
    });
  });
});
