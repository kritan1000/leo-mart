import { KhaltiService } from '../../services/khalti_service';
import Product from '../../models/product_model';
import Order from '../../models/order_model';
import PendingPayment from '../../models/pending_payment_model';
import User from '../../models/user_model';
import mongoose from 'mongoose';
import { connectTestDB, disconnectTestDB, clearCollections } from '../helpers';

jest.mock('axios');
const axios = require('axios');

jest.mock('../../utils/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
  passwordResetEmailTemplate: jest.fn().mockReturnValue('<html></html>'),
}));

beforeAll(async () => { await connectTestDB(); });
afterAll(async () => { await disconnectTestDB(); });
afterEach(async () => {
  await clearCollections();
  jest.clearAllMocks();
});

describe('KhaltiService', () => {
  let khaltiService: KhaltiService;
  let testProduct: any;
  let testUser: any;

  beforeEach(async () => {
    process.env.KHALTI_SECRET_KEY = 'test-secret-key';
    process.env.KHALTI_BASE_URL = 'https://khalti.com';
    process.env.FRONTEND_URL = 'http://localhost:3000';
    khaltiService = new KhaltiService();

    testUser = await User.create({
      username: 'khaltitest',
      email: 'khalti@test.com',
      password: 'password123',
      fullname: 'Khalti Test',
      role: 'user',
    });

    testProduct = await Product.create({
      name: 'Khalti Product', description: 'Product for Khalti testing', price: 500,
      category: 'Test', brand: 'TestBrand', stockStatus: 'in-stock', image: '/uploads/test.jpg',
    });
  });

  describe('initiatePayment', () => {
    it('should initiate payment successfully', async () => {
      axios.post.mockResolvedValue({
        data: { pidx: 'test-pidx-123', payment_url: 'https://khalti.com/pay/test' },
      });

      const result = await khaltiService.initiatePayment({
        userId: testUser._id.toString(),
        customerInfo: { fullname: 'John', email: 'john@test.com', phone: '9800000000' },
        shippingAddress: { street: '123 Main', city: 'Kathmandu', district: 'Kathmandu' },
        items: [{ productId: testProduct._id.toString(), quantity: 2 }],
      });

      expect(result.success).toBe(true);
      expect(result.pidx).toBe('test-pidx-123');
      expect(result.payment_url).toBeDefined();

      const pending = await PendingPayment.findOne({ pidx: 'test-pidx-123' });
      expect(pending).toBeDefined();
      expect(pending!.totalAmount).toBe(1100);
    });

    it('should throw error when cart is empty', async () => {
      await expect(khaltiService.initiatePayment({
        userId: testUser._id.toString(),
        customerInfo: { fullname: 'John', email: 'john@test.com', phone: '9800000000' },
        shippingAddress: { street: '123 Main', city: 'Kathmandu', district: 'Kathmandu' },
        items: [],
      })).rejects.toThrow('Cart is empty');
    });

    it('should throw error when product not found and no price provided', async () => {
      await expect(khaltiService.initiatePayment({
        userId: testUser._id.toString(),
        customerInfo: { fullname: 'John', email: 'john@test.com', phone: '9800000000' },
        shippingAddress: { street: '123 Main', city: 'Kathmandu', district: 'Kathmandu' },
        items: [{ productId: new mongoose.Types.ObjectId().toString(), quantity: 1 }],
      })).rejects.toThrow(/Product not found/);
    });

    it('should throw error when Khalti API fails', async () => {
      axios.post.mockRejectedValue(new Error('Khalti API error'));

      await expect(khaltiService.initiatePayment({
        userId: testUser._id.toString(),
        customerInfo: { fullname: 'John', email: 'john@test.com', phone: '9800000000' },
        shippingAddress: { street: '123 Main', city: 'Kathmandu', district: 'Kathmandu' },
        items: [{ productId: testProduct._id.toString(), quantity: 1 }],
      })).rejects.toThrow();
    });

    it('should throw error when response missing pidx', async () => {
      axios.post.mockResolvedValue({ data: {} });

      await expect(khaltiService.initiatePayment({
        userId: testUser._id.toString(),
        customerInfo: { fullname: 'John', email: 'john@test.com', phone: '9800000000' },
        shippingAddress: { street: '123 Main', city: 'Kathmandu', district: 'Kathmandu' },
        items: [{ productId: testProduct._id.toString(), quantity: 1 }],
      })).rejects.toThrow('Failed to initiate payment');
    });

    it('should work without userId (guest)', async () => {
      axios.post.mockResolvedValue({
        data: { pidx: 'guest-pidx', payment_url: 'https://khalti.com/pay/guest' },
      });

      const result = await khaltiService.initiatePayment({
        customerInfo: { fullname: 'Guest', email: 'guest@test.com', phone: '9800000000' },
        shippingAddress: { street: '123 Main', city: 'Kathmandu', district: 'Kathmandu' },
        items: [{ productId: testProduct._id.toString(), quantity: 1 }],
      });

      expect(result.success).toBe(true);
      const pending = await PendingPayment.findOne({ pidx: 'guest-pidx' });
      expect(pending!.user).toBeUndefined();
    });

    it('should use fallback price when product not in DB', async () => {
      axios.post.mockResolvedValue({
        data: { pidx: 'fallback-pidx', payment_url: 'https://khalti.com/pay/fallback' },
      });

      const fakeId = new mongoose.Types.ObjectId().toString();
      const result = await khaltiService.initiatePayment({
        customerInfo: { fullname: 'Test', email: 'test@test.com', phone: '9800000000' },
        shippingAddress: { street: '123 Main', city: 'Kathmandu', district: 'Kathmandu' },
        items: [{ productId: fakeId, quantity: 1, price: 250 }],
      });

      expect(result.success).toBe(true);
    });
  });

  describe('verifyPayment', () => {
    it('should verify payment successfully with pending payment', async () => {
      const pending = await PendingPayment.create({
        pidx: 'verify-pidx',
        purchaseOrderId: 'ORD-TEST',
        user: testUser._id,
        customerInfo: { fullname: 'John', email: 'john@test.com', phone: '9800000000' },
        shippingAddress: { street: '123 Main', city: 'Kathmandu', district: 'Kathmandu' },
        items: [{ productId: testProduct._id, name: 'Product', price: 500, quantity: 1 }],
        subtotal: 500, deliveryCharge: 100, discount: 0, totalAmount: 600, amountPaisa: 60000,
      });

      axios.post.mockResolvedValue({
        data: { status: 'Completed', transaction_id: 'txn-123', total_amount: 60000, purchase_order_id: 'ORD-TEST' },
      });

      const result = await khaltiService.verifyPayment('verify-pidx');
      expect(result.success).toBe(true);

      const order = await Order.findOne({ pidx: 'verify-pidx' });
      expect(order).toBeDefined();
      expect(order!.paymentStatus).toBe('Paid');

      const deletedPending = await PendingPayment.findOne({ pidx: 'verify-pidx' });
      expect(deletedPending).toBeNull();
    });

    it('should return existing order if already verified', async () => {
      const existingOrder = await Order.create({
        user: testUser._id, pidx: 'existing-pidx',
        customerInfo: { fullname: 'John', email: 'john@test.com', phone: '9800000000' },
        shippingAddress: { street: '123 Main', city: 'Kathmandu', district: 'Kathmandu' },
        items: [{ productId: testProduct._id, name: 'Product', price: 500, quantity: 1 }],
        subtotal: 500, deliveryCharge: 100, discount: 0, totalAmount: 600,
        paymentMethod: 'Khalti', paymentStatus: 'Paid', orderStatus: 'Processing',
      });

      const result = await khaltiService.verifyPayment('existing-pidx');
      expect(result.success).toBe(true);
      expect(result.message).toMatch(/already verified/);
    });

    it('should throw error when pidx is empty', async () => {
      await expect(khaltiService.verifyPayment('')).rejects.toThrow('pidx parameter is required');
    });

    it('should return failure when Khalti status is not Completed', async () => {
      axios.post.mockResolvedValue({ data: { status: 'Pending' } });

      const result = await khaltiService.verifyPayment('pending-pidx');
      expect(result.success).toBe(false);
    });

    it('should create fallback order when no pending payment found', async () => {
      axios.post.mockResolvedValue({
        data: {
          status: 'Completed', transaction_id: 'txn-fallback',
          total_amount: 50000, purchase_order_id: 'ORD-FALLBACK',
          user: { name: 'Fallback User', email: 'fb@test.com', mobile: '9800000000' },
        },
      });

      const result = await khaltiService.verifyPayment('fallback-pidx');
      expect(result.success).toBe(true);

      const order = await Order.findOne({ pidx: 'fallback-pidx' });
      expect(order).toBeDefined();
      expect(order!.customerInfo.fullname).toBe('Fallback User');
    });
  });
});
