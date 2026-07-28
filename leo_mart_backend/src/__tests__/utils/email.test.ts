const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-id' });
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({ sendMail: mockSendMail }),
}));

import { sendEmail, passwordResetEmailTemplate } from '../../utils/email';

beforeEach(() => { mockSendMail.mockClear(); });

describe('Email Utils', () => {
  describe('sendEmail', () => {
    it('should send email with correct options', async () => {
      await sendEmail({ to: 'test@example.com', subject: 'Test Subject', html: '<p>Body</p>' });
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Test Subject',
          html: '<p>Body</p>',
        })
      );
    });

    it('should use EMAIL_FROM env or SMTP_USER as from', async () => {
      await sendEmail({ to: 'a@b.com', subject: 'S', html: '<p>H</p>' });
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({ from: process.env.EMAIL_FROM || process.env.SMTP_USER })
      );
    });
  });

  describe('passwordResetEmailTemplate', () => {
    it('should contain reset URL', () => {
      const html = passwordResetEmailTemplate('https://example.com/reset/abc');
      expect(html).toContain('https://example.com/reset/abc');
    });

    it('should contain LeoMart branding', () => {
      const html = passwordResetEmailTemplate('http://test.com');
      expect(html).toContain('LeoMart');
      expect(html).toContain('Reset Password');
    });
  });
});
