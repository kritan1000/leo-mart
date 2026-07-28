import request from 'supertest';
import app from '../../app';
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

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await clearCollections();
});

describe('Product API', () => {
  let adminToken: string;
  let userToken: string;
  let adminUser: any;

  beforeEach(async () => {
    adminUser = await User.create({
      username: 'adminprod',
      email: 'admin-prod@example.com',
      password: await bcrypt.hash('password123', 10),
      fullname: 'Admin Product User',
      role: 'admin',
    });
    adminToken = jwt.sign(
      { id: adminUser._id, email: adminUser.email, role: adminUser.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    const regularUser = await User.create({
      username: 'regularprod',
      email: 'regular-prod@example.com',
      password: await bcrypt.hash('password123', 10),
      fullname: 'Regular Product User',
      role: 'user',
    });
    userToken = jwt.sign(
      { id: regularUser._id, email: regularUser.email, role: regularUser.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
  });

  describe('POST /api/v1/products', () => {
    it('should create a product when admin is authenticated', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Test Product')
        .field('description', 'A test product description')
        .field('price', '199')
        .field('category', 'Electronics')
        .field('brand', 'TestBrand')
        .field('stockStatus', 'in-stock')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/product created successfully/i);
      expect(res.body.data).toBeDefined();
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .field('name', 'Test Product')
        .field('description', 'A test product description')
        .field('price', '199')
        .field('category', 'Electronics')
        .field('brand', 'TestBrand')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg');

      expect(res.status).toBe(401);
    });

    it('should return 403 when non-admin user tries to create', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${userToken}`)
        .field('name', 'Test Product')
        .field('description', 'A test product description')
        .field('price', '199')
        .field('category', 'Electronics')
        .field('brand', 'TestBrand')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg');

      expect(res.status).toBe(403);
    });

    it('should return 400 when image is missing', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product',
          description: 'A test product description',
          price: 199,
          category: 'Electronics',
          brand: 'TestBrand',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/image/i);
    });

    it('should return 400 for invalid product data', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', '')
        .field('description', '')
        .field('price', '-10')
        .field('category', '')
        .field('brand', '')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg');

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/products', () => {
    beforeEach(async () => {
      await Product.create([
        { name: 'Apple', description: 'Fresh apples', price: 100, category: 'Fruits', brand: 'Organic', stockStatus: 'in-stock', image: '/uploads/apple.jpg' },
        { name: 'Banana', description: 'Fresh bananas', price: 50, category: 'Fruits', brand: 'Organic', stockStatus: 'in-stock', image: '/uploads/banana.jpg' },
        { name: 'Milk', description: 'Fresh milk', price: 80, category: 'Dairy', brand: 'DairyCo', stockStatus: 'low-stock', image: '/uploads/milk.jpg' },
      ]);
    });

    it('should return paginated products', async () => {
      const res = await request(app).get('/api/v1/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toBeInstanceOf(Array);
      expect(res.body.data.total).toBe(3);
    });

    it('should filter products by search term', async () => {
      const res = await request(app).get('/api/v1/products?search=apple');
      expect(res.status).toBe(200);
      expect(res.body.data.data.length).toBe(1);
      expect(res.body.data.data[0].name).toBe('Apple');
    });

    it('should filter products by category', async () => {
      const res = await request(app).get('/api/v1/products?category=Fruits');
      expect(res.status).toBe(200);
      expect(res.body.data.data.length).toBe(2);
    });

    it('should paginate products with page and size', async () => {
      const res = await request(app).get('/api/v1/products?page=1&size=2');
      expect(res.status).toBe(200);
      expect(res.body.data.data.length).toBe(2);
      expect(res.body.data.totalPages).toBe(2);
    });
  });

  describe('GET /api/v1/products/:id', () => {
    it('should return a product by ID', async () => {
      const product = await Product.create({
        name: 'Test Item', description: 'Test description', price: 250,
        category: 'Test', brand: 'TestBrand', stockStatus: 'in-stock', image: '/uploads/test.jpg',
      });

      const res = await request(app).get(`/api/v1/products/${product._id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Item');
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/v1/products/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/v1/products/:id', () => {
    it('should update a product as admin', async () => {
      const product = await Product.create({
        name: 'Old Name', description: 'Old description', price: 100,
        category: 'Test', brand: 'TestBrand', stockStatus: 'in-stock', image: '/uploads/test.jpg',
      });

      const res = await request(app)
        .put(`/api/v1/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Name', price: 200 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('New Name');
    });

    it('should return 404 when updating non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/api/v1/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated' });

      expect(res.status).toBe(404);
    });

    it('should return 403 when non-admin tries to update', async () => {
      const product = await Product.create({
        name: 'Test', description: 'Test desc', price: 100,
        category: 'Test', brand: 'TestBrand', stockStatus: 'in-stock', image: '/uploads/test.jpg',
      });

      const res = await request(app)
        .put(`/api/v1/products/${product._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Hacked' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    it('should delete a product as admin', async () => {
      const product = await Product.create({
        name: 'To Delete', description: 'Delete me', price: 50,
        category: 'Test', brand: 'TestBrand', stockStatus: 'in-stock', image: '/uploads/test.jpg',
      });

      const res = await request(app)
        .delete(`/api/v1/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const found = await Product.findById(product._id);
      expect(found).toBeNull();
    });

    it('should return 404 when deleting non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .delete(`/api/v1/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });

    it('should return 403 when non-admin tries to delete', async () => {
      const product = await Product.create({
        name: 'Protected', description: 'Cannot delete', price: 50,
        category: 'Test', brand: 'TestBrand', stockStatus: 'in-stock', image: '/uploads/test.jpg',
      });

      const res = await request(app)
        .delete(`/api/v1/products/${product._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });
});
