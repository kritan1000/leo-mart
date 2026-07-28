import request from 'supertest';
import app from '../../app';
import Blog from '../../models/blog_model';
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

describe('Blog API', () => {
  let authToken: string;
  let testUser: any;

  beforeEach(async () => {
    testUser = await User.create({
      username: 'bloguser',
      email: 'blog@example.com',
      password: await bcrypt.hash('password123', 10),
      fullname: 'Blog User',
      role: 'user',
    });
    authToken = jwt.sign(
      { id: testUser._id, email: testUser.email, role: testUser.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
  });

  describe('POST /api/v1/blogs', () => {
    it('should create a blog when authenticated', async () => {
      const res = await request(app)
        .post('/api/v1/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Blog Post',
          content: 'This is a test blog post content that is long enough.',
          tags: ['test', 'blog'],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Blog Post');
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .post('/api/v1/blogs')
        .send({
          title: 'Test Blog',
          content: 'This is test content for the blog.',
        });

      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid blog data', async () => {
      const res = await request(app)
        .post('/api/v1/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '',
          content: '',
        });

      expect(res.status).toBe(400);
    });

    it('should return 400 when title is too short', async () => {
      const res = await request(app)
        .post('/api/v1/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'ab',
          content: 'This is valid content that is long enough.',
        });

      expect(res.status).toBe(400);
    });

    it('should return 400 when content is too short', async () => {
      const res = await request(app)
        .post('/api/v1/blogs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Valid Title',
          content: 'short',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/blogs', () => {
    beforeEach(async () => {
      const user = await User.create({
        username: 'blogdata',
        email: 'blogdata@example.com',
        password: await bcrypt.hash('password123', 10),
        fullname: 'Blog Data User',
        role: 'user',
      });
      await Blog.create([
        { title: 'First Blog', content: 'First blog content that is long enough', author: user._id },
        { title: 'Second Blog', content: 'Second blog content that is long enough', author: user._id },
      ]);
    });

    it('should return paginated blogs', async () => {
      const res = await request(app).get('/api/v1/blogs');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toBeInstanceOf(Array);
      expect(res.body.data.total).toBe(2);
    });

    it('should search blogs by title', async () => {
      const res = await request(app).get('/api/v1/blogs?search=First');
      expect(res.status).toBe(200);
      expect(res.body.data.data.length).toBe(1);
      expect(res.body.data.data[0].title).toBe('First Blog');
    });
  });

  describe('GET /api/v1/blogs/:id', () => {
    it('should return a blog by ID', async () => {
      const blog = await Blog.create({
        title: 'Findable Blog',
        content: 'This blog can be found by ID',
        author: testUser._id,
      });

      const res = await request(app).get(`/api/v1/blogs/${blog._id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Findable Blog');
    });

    it('should return 404 for non-existent blog', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/v1/blogs/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/v1/blogs/:id', () => {
    it('should update a blog when authenticated', async () => {
      const blog = await Blog.create({
        title: 'Old Title',
        content: 'Old content that is long enough for validation',
        author: testUser._id,
      });

      const res = await request(app)
        .put(`/api/v1/blogs/${blog._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'New Title' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('New Title');
    });

    it('should return 404 when updating non-existent blog', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/api/v1/blogs/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' });

      expect(res.status).toBe(404);
    });

    it('should return 400 for invalid update data', async () => {
      const blog = await Blog.create({
        title: 'Valid Blog',
        content: 'Valid content for the blog post',
        author: testUser._id,
      });

      const res = await request(app)
        .put(`/api/v1/blogs/${blog._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'ab' });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/v1/blogs/:id', () => {
    it('should delete a blog when authenticated', async () => {
      const blog = await Blog.create({
        title: 'To Delete',
        content: 'This blog will be deleted',
        author: testUser._id,
      });

      const res = await request(app)
        .delete(`/api/v1/blogs/${blog._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const found = await Blog.findById(blog._id);
      expect(found).toBeNull();
    });

    it('should return 404 when deleting non-existent blog', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .delete(`/api/v1/blogs/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });

    it('should return 401 when not authenticated', async () => {
      const blog = await Blog.create({
        title: 'Protected Blog',
        content: 'Cannot delete without auth',
        author: testUser._id,
      });

      const res = await request(app).delete(`/api/v1/blogs/${blog._id}`);
      expect(res.status).toBe(401);
    });
  });
});
