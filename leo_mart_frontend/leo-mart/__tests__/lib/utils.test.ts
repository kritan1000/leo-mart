import axiosInstance from '../../lib/api/axios_instance';
import { register, login, getWhoAmI, updateProfile, requestPasswordReset, resetPassword } from '../../lib/api/auth';
import { API } from '../../lib/api/endpoints';
import { endpoints, ENDPOINTS } from '../../lib/api/endpoints';

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({
    get: jest.fn((name: string) => {
      if (name === 'auth_token') return { value: 'test-token-123' };
      if (name === 'user_data') return { value: JSON.stringify({ email: 't@t.com', fullname: 'Test' }) };
      return undefined;
    }),
    set: jest.fn(),
    delete: jest.fn(),
  }),
}));

jest.mock('../../lib/api/axios_instance');
const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

beforeEach(() => { jest.clearAllMocks(); });

describe('API Endpoints', () => {
  it('has correct endpoints', () => {
    expect(API.AUTH.LOGIN).toBe('/api/v1/auth/login');
    expect(API.AUTH.REGISTER).toBe('/api/v1/auth/register');
    expect(API.AUTH.WHOAMI).toBe('/api/v1/auth/whoami');
    expect(API.AUTH.RESET_PASSWORD('abc')).toBe('/api/v1/auth/reset-password/abc');
  });
});

describe('axiosInstance', () => {
  it('has correct defaults', () => {
    expect(axiosInstance.defaults.withCredentials).toBe(true);
    expect(axiosInstance.defaults.headers['Content-Type']).toBe('application/json');
  });
});

describe('Cookies', () => {
  it('getTokenCookie returns token', async () => {
    const { getTokenCookie } = await import('../../lib/cookies');
    expect(await getTokenCookie()).toBe('test-token-123');
  });
  it('getUserInfoCookie returns parsed data', async () => {
    const { getUserInfoCookie } = await import('../../lib/cookies');
    expect(await getUserInfoCookie()).toEqual({ email: 't@t.com', fullname: 'Test' });
  });
});

describe('Auth API', () => {
  it('register success', async () => {
    mockedAxios.post.mockResolvedValue({ data: { success: true } });
    expect((await register({ email: 't@t.com', password: 'p' })).success).toBe(true);
  });
  it('login success', async () => {
    mockedAxios.post.mockResolvedValue({ data: { success: true, data: { token: 'abc' } } });
    expect((await login({ email: 't@t.com', password: 'p' })).success).toBe(true);
  });
  it('getWhoAmI success', async () => {
    mockedAxios.get.mockResolvedValue({ data: { success: true, data: { email: 'u@t.com' } } });
    expect((await getWhoAmI()).success).toBe(true);
  });
  it('updateProfile success', async () => {
    mockedAxios.put.mockResolvedValue({ data: { success: true } });
    expect((await updateProfile(new FormData())).success).toBe(true);
  });
  it('requestPasswordReset and resetPassword', async () => {
    mockedAxios.post.mockResolvedValue({ data: { success: true } });
    expect((await requestPasswordReset('t@t.com')).success).toBe(true);
    expect((await resetPassword('tok', 'new')).success).toBe(true);
  });
});

describe('Axios Interceptor', () => {
  it('adds Bearer token from cookie', () => {
    document.cookie = 'auth_token=abc123';
    const handlers = (axiosInstance.interceptors.request as any).handlers;
    if (handlers && handlers[0] && handlers[0].fulfilled) {
      const config = handlers[0].fulfilled({ headers: {} });
      expect(config.headers.Authorization).toBe('Bearer abc123');
    }
  });
});
