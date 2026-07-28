import request from 'supertest';
import app from '../../app';
import { connectTestDB, disconnectTestDB, clearCollections } from '../helpers';

jest.mock('../../utils/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
  passwordResetEmailTemplate: jest.fn().mockReturnValue('<html></html>'),
}));

jest.mock('../../services/geminiService', () => ({
  GeminiService: jest.fn().mockImplementation(() => ({
    chat: jest.fn().mockResolvedValue('I am a helpful AI assistant for LeoMart.'),
  })),
}));

beforeAll(async () => { await connectTestDB(); });
afterAll(async () => { await disconnectTestDB(); });
afterEach(async () => { await clearCollections(); });

describe('Chat API', () => {
  describe('POST /api/chat', () => {
    it('should return a reply for valid message', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'What products do you have?' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.reply).toBeDefined();
    });

    it('should return 400 when message is empty', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: '' });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/empty/i);
    });

    it('should return 400 when message is missing', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({});
      expect(res.status).toBe(400);
    });

    it('should return 400 when message exceeds 2000 characters', async () => {
      const longMessage = 'a'.repeat(2001);
      const res = await request(app)
        .post('/api/chat')
        .send({ message: longMessage });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/too long/i);
    });

    it('should accept message with conversation history', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({
          message: 'Tell me more',
          history: [
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi there!' },
          ],
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should trim whitespace from message', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: '   Hello there   ' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
