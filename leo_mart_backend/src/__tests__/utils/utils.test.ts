import { ApiResponseHelper } from '../../utils/api-response';
import { passwordResetEmailTemplate } from '../../utils/email';

describe('ApiResponseHelper', () => {
  let mockRes: any;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('success', () => {
    it('should return 200 by default', () => {
      ApiResponseHelper.success(mockRes, { name: 'Test' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: { name: 'Test' } })
      );
    });

    it('should use custom status code', () => {
      ApiResponseHelper.success(mockRes, { id: 1 }, 201, 'Created');
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Created' })
      );
    });

    it('should include pagination meta when provided', () => {
      const meta = { page: 1, limit: 10, total: 50 };
      ApiResponseHelper.success(mockRes, [], 200, 'OK', meta);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ meta })
      );
    });
  });

  describe('error', () => {
    it('should return 500 by default', () => {
      ApiResponseHelper.error(mockRes, 'Something went wrong');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: 'Something went wrong' })
      );
    });

    it('should use custom status code', () => {
      ApiResponseHelper.error(mockRes, 'Not Found', 404);
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should use default error message', () => {
      ApiResponseHelper.error(mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Error' })
      );
    });
  });
});

describe('passwordResetEmailTemplate', () => {
  it('should return HTML string containing the reset URL', () => {
    const url = 'http://localhost:3000/reset-password?token=abc123';
    const html = passwordResetEmailTemplate(url);
    expect(html).toContain(url);
    expect(html).toContain('LeoMart');
    expect(html).toContain('Reset Password');
  });

  it('should return valid HTML structure', () => {
    const html = passwordResetEmailTemplate('http://test.com');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('</html>');
  });

  it('should include expiry notice', () => {
    const html = passwordResetEmailTemplate('http://test.com');
    expect(html).toContain('1 hour');
  });
});
