const mockGenerateContent = jest.fn();

jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  })),
}));

jest.mock('../../utils/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
  passwordResetEmailTemplate: jest.fn().mockReturnValue('<html></html>'),
}));

import { GeminiService } from '../../services/geminiService';

describe('GeminiService', () => {
  let geminiService: GeminiService;

  beforeEach(() => {
    jest.clearAllMocks();
    geminiService = new GeminiService();
  });

  it('should return AI response for valid messages', async () => {
    mockGenerateContent.mockResolvedValue({ text: 'Hello! How can I help you?' });

    const result = await geminiService.chat([
      { role: 'user', content: 'What products do you have?' },
    ]);

    expect(result).toBe('Hello! How can I help you?');
    expect(mockGenerateContent).toHaveBeenCalled();
  });

  it('should return default message when response has no text', async () => {
    mockGenerateContent.mockResolvedValue({});

    const result = await geminiService.chat([
      { role: 'user', content: 'Hello' },
    ]);

    expect(result).toContain("couldn't generate");
  });

  it('should handle multiple messages in conversation', async () => {
    mockGenerateContent.mockResolvedValue({ text: 'Sure, I can help with that.' });

    const result = await geminiService.chat([
      { role: 'user', content: 'Hi' },
      { role: 'assistant', content: 'Hello!' },
      { role: 'user', content: 'Tell me about products' },
    ]);

    expect(result).toBe('Sure, I can help with that.');
    const callArgs = mockGenerateContent.mock.calls[0][0];
    expect(callArgs.contents).toHaveLength(3);
  });

  it('should throw error when API call fails', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API key invalid'));

    await expect(geminiService.chat([
      { role: 'user', content: 'Test' },
    ])).rejects.toThrow('API key invalid');
  });

  it('should map assistant role to model role', async () => {
    mockGenerateContent.mockResolvedValue({ text: 'Response' });

    await geminiService.chat([
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi' },
    ]);

    const callArgs = mockGenerateContent.mock.calls[0][0];
    expect(callArgs.contents[0].role).toBe('user');
    expect(callArgs.contents[1].role).toBe('model');
  });
});
