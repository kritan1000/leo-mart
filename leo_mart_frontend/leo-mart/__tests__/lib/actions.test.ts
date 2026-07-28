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
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));

const mockFetch = jest.fn();
global.fetch = mockFetch;

import { registerUser, loginUser, requestPasswordResetAction, resetPasswordAction, applyBusinessAccountAction } from '../../lib/actions/auth-action';
import { createCodOrderAction, fetchOrderByIdAction, fetchUserOrdersAction, fetchAllOrdersAction, updateOrderStatusAction } from '../../lib/actions/order-action';
import { fetchBlogsAction, createBlogAction, updateBlogAction, deleteBlogAction, fetchBlogByIdAction } from '../../lib/actions/blog-action';
import { fetchProductsAction, createProductAction, updateProductAction, deleteProductAction, fetchProductByIdAction } from '../../lib/actions/product-action';
import { submitQuotationAction, fetchQuotationsAction, updateQuotationStatusAction } from '../../lib/actions/quotation-action';
import { initiateKhaltiAction, verifyKhaltiAction } from '../../lib/actions/payment-action';
import { fetchUsersAction, createUserAction, updateUserAction, deleteUserAction, fetchUserByIdAction, fetchBusinessAccountsAction, updateBusinessAccountStatusAction } from '../../lib/actions/user-action';
import { getTokenCookie, setTokenCookie, clearAuthCookies, getUserInfoCookie } from '../../lib/cookies';

beforeEach(() => jest.clearAllMocks());

const payload = { customerInfo: { fullname: 'J', email: 'j@t.com', phone: '980' }, shippingAddress: { street: '123', city: 'KTM', district: 'KTM' }, items: [{ productId: 'p1', quantity: 1 }] };
const noTok = () => jest.mocked(require('next/headers').cookies).mockResolvedValueOnce({ get: jest.fn().mockReturnValue(undefined), set: jest.fn() } as any);
const okJson = (d: any = {}) => ({ ok: true, json: jest.fn().mockResolvedValue(d) });

describe('Auth Actions', () => {
  it('register success and error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true }));
    expect((await registerUser({ email: 't@t.com', password: 'pass123', confirmPassword: 'pass123', fullName: 'T' } as any)).success).toBe(true);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await registerUser({ email: 't@t.com', password: 'p', confirmPassword: 'p', fullName: 'T' } as any)).success).toBe(false);
  });
  it('login success and failure', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true, data: { token: 'abc' } }));
    expect((await loginUser({ email: 't@t.com', password: 'p' } as any)).success).toBe(true);
    mockFetch.mockResolvedValue(okJson({ success: false }));
    expect((await loginUser({ email: 't@t.com', password: 'w' } as any)).success).toBe(false);
  });
  it('login error', async () => { mockFetch.mockRejectedValue(new Error('Net')); expect((await loginUser({ email: 't@t.com', password: 'p' } as any)).success).toBe(false); });
  it('requestPasswordReset and resetPassword', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true }));
    expect((await requestPasswordResetAction('t@t.com')).success).toBe(true);
    expect((await resetPasswordAction('token', 'new')).success).toBe(true);
  });
  it('applyBusinessAccount success, no token, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true, data: {} }));
    expect((await applyBusinessAccountAction({ businessName: 'B', registrationNo: 'R1' })).success).toBe(true);
    await noTok();
    expect((await applyBusinessAccountAction({ businessName: 'B', registrationNo: 'R1' })).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await applyBusinessAccountAction({ businessName: 'B', registrationNo: 'R1' })).success).toBe(false);
  });
});

describe('Order Actions', () => {
  it('createCod success, no token, failure, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true, order: { _id: '1' } }));
    expect((await createCodOrderAction(payload)).success).toBe(true);
    await noTok();
    mockFetch.mockResolvedValue(okJson({ success: true, order: {} }));
    expect((await createCodOrderAction(payload)).success).toBe(true);
    mockFetch.mockResolvedValue(okJson({ success: false, message: 'No stock' }));
    expect((await createCodOrderAction(payload)).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await createCodOrderAction(payload)).success).toBe(false);
  });
  it('fetchById success, failure, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true, order: {} }));
    expect((await fetchOrderByIdAction('1')).success).toBe(true);
    mockFetch.mockResolvedValue(okJson({ success: false }));
    expect((await fetchOrderByIdAction('1')).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await fetchOrderByIdAction('1')).success).toBe(false);
  });
  it('fetchUserOrders success, failure, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true, data: [] }));
    expect((await fetchUserOrdersAction()).success).toBe(true);
    mockFetch.mockResolvedValue(okJson({ success: false }));
    expect((await fetchUserOrdersAction()).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await fetchUserOrdersAction()).success).toBe(false);
  });
  it('fetchAllOrders success, failure, with status, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true, data: [] }));
    expect((await fetchAllOrdersAction()).success).toBe(true);
    mockFetch.mockResolvedValue(okJson({ success: false }));
    expect((await fetchAllOrdersAction()).success).toBe(false);
    mockFetch.mockResolvedValue(okJson({ success: true, data: [] }));
    await fetchAllOrdersAction(1, 20, 'Pending');
    expect(mockFetch.mock.calls[mockFetch.mock.calls.length - 1][0]).toContain('status=Pending');
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await fetchAllOrdersAction()).success).toBe(false);
  });
  it('updateStatus success, no token, failure, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true }));
    expect((await updateOrderStatusAction('1', 'Shipped')).success).toBe(true);
    await noTok();
    mockFetch.mockResolvedValue(okJson({ success: true }));
    expect((await updateOrderStatusAction('1', 'Shipped')).success).toBe(true);
    mockFetch.mockResolvedValue(okJson({ success: false }));
    expect((await updateOrderStatusAction('1', 'Bad')).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await updateOrderStatusAction('1', 'Shipped')).success).toBe(false);
  });
});

describe('Blog Actions', () => {
  it('fetch success, failure, HTTP error, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true, data: [] }));
    expect((await fetchBlogsAction({})).success).toBe(true);
    mockFetch.mockResolvedValue(okJson({ success: false }));
    expect((await fetchBlogsAction({})).success).toBe(false);
    mockFetch.mockResolvedValue({ ok: false });
    expect((await fetchBlogsAction({})).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await fetchBlogsAction({})).success).toBe(false);
  });
  it('create success, no token', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true }));
    expect((await createBlogAction({ title: 'T', content: 'C' })).success).toBe(true);
    await noTok();
    expect((await createBlogAction({ title: 'T', content: 'C' })).success).toBe(false);
  });
  it('update success', async () => { mockFetch.mockResolvedValue(okJson({ success: true })); expect((await updateBlogAction('1', { title: 'U' })).success).toBe(true); });
  it('delete success, no token, failure', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true }));
    expect((await deleteBlogAction('1')).success).toBe(true);
    await noTok();
    expect((await deleteBlogAction('1')).success).toBe(false);
    mockFetch.mockResolvedValue(okJson({ success: false, message: 'Not found' }));
    expect((await deleteBlogAction('1')).success).toBe(false);
  });
  it('fetchById success, failure, HTTP error, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true, data: { title: 'B' } }));
    expect((await fetchBlogByIdAction('1')).success).toBe(true);
    mockFetch.mockResolvedValue(okJson({ success: false }));
    expect((await fetchBlogByIdAction('1')).success).toBe(false);
    mockFetch.mockResolvedValue({ ok: false });
    expect((await fetchBlogByIdAction('1')).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await fetchBlogByIdAction('1')).success).toBe(false);
  });
});

describe('Product Actions', () => {
  it('fetch success with filters, non-success, HTTP error, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true, data: [] }));
    expect((await fetchProductsAction({})).success).toBe(true);
    await fetchProductsAction({ minPrice: 100, maxPrice: 500 });
    expect(mockFetch.mock.calls[mockFetch.mock.calls.length - 1][0]).toContain('minPrice=100');
    mockFetch.mockResolvedValue(okJson({ success: false }));
    expect((await fetchProductsAction({})).success).toBe(false);
    mockFetch.mockResolvedValue({ ok: false });
    expect((await fetchProductsAction({})).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await fetchProductsAction({})).success).toBe(false);
  });
  it('create success, no token', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true }));
    expect((await createProductAction(new FormData())).success).toBe(true);
    await noTok();
    expect((await createProductAction(new FormData())).success).toBe(false);
  });
  it('update success', async () => { mockFetch.mockResolvedValue(okJson({ success: true })); expect((await updateProductAction('p1', new FormData())).success).toBe(true); });
  it('delete success, no token, failure', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true }));
    expect((await deleteProductAction('p1')).success).toBe(true);
    await noTok();
    expect((await deleteProductAction('p1')).success).toBe(false);
    mockFetch.mockResolvedValue(okJson({ success: false, message: 'Not found' }));
    expect((await deleteProductAction('p1')).success).toBe(false);
  });
  it('fetchById success, failure, HTTP error, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true, data: {} }));
    expect((await fetchProductByIdAction('p1')).success).toBe(true);
    mockFetch.mockResolvedValue(okJson({ success: false }));
    expect((await fetchProductByIdAction('p1')).success).toBe(false);
    mockFetch.mockResolvedValue({ ok: false });
    expect((await fetchProductByIdAction('p1')).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await fetchProductByIdAction('p1')).success).toBe(false);
  });
});

describe('Quotation Actions', () => {
  it('submit success, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true }));
    expect((await submitQuotationAction({ companyName: 'C', email: 'e', phone: '9', items: 'W' })).success).toBe(true);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await submitQuotationAction({ companyName: 'C', email: 'e', phone: '9', items: 'W' })).success).toBe(false);
  });
  it('fetch success, no token, non-success, HTTP error, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true, data: [] }));
    expect((await fetchQuotationsAction({})).success).toBe(true);
    await noTok();
    expect((await fetchQuotationsAction({})).success).toBe(false);
    mockFetch.mockResolvedValue(okJson({ success: false }));
    expect((await fetchQuotationsAction({})).success).toBe(false);
    mockFetch.mockResolvedValue({ ok: false });
    expect((await fetchQuotationsAction({})).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await fetchQuotationsAction({})).success).toBe(false);
  });
  it('updateStatus success, no token, failure, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true }));
    expect((await updateQuotationStatusAction('1', 'completed')).success).toBe(true);
    await noTok();
    expect((await updateQuotationStatusAction('1', 'completed')).success).toBe(false);
    mockFetch.mockResolvedValue(okJson({ success: false }));
    expect((await updateQuotationStatusAction('1', 'completed')).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await updateQuotationStatusAction('1', 'completed')).success).toBe(false);
  });
});

describe('Payment Actions', () => {
  it('initiateKhalti success, no token, failure, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true, data: { payment_url: 'https://pay.khalti.com', pidx: 'p1' } }));
    expect((await initiateKhaltiAction(payload)).success).toBe(true);
    await noTok();
    mockFetch.mockResolvedValue(okJson({ success: true, data: { payment_url: 'https://pay.khalti.com', pidx: 'p1' } }));
    expect((await initiateKhaltiAction(payload)).success).toBe(true);
    mockFetch.mockResolvedValue(okJson({ success: false, message: 'Failed' }));
    expect((await initiateKhaltiAction(payload)).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await initiateKhaltiAction(payload)).success).toBe(false);
  });
  it('verifyKhalti success, no token, failure, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true, message: 'OK' }));
    expect((await verifyKhaltiAction('pidx')).success).toBe(true);
    await noTok();
    mockFetch.mockResolvedValue(okJson({ success: true }));
    expect((await verifyKhaltiAction('pidx')).success).toBe(true);
    mockFetch.mockResolvedValue(okJson({ success: false }));
    expect((await verifyKhaltiAction('bad')).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await verifyKhaltiAction('pidx')).success).toBe(false);
  });
});

describe('User Actions', () => {
  it('fetch success, no token, non-success, HTTP error, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true, data: [] }));
    expect((await fetchUsersAction({})).success).toBe(true);
    await noTok();
    expect((await fetchUsersAction({})).success).toBe(false);
    mockFetch.mockResolvedValue(okJson({ success: false }));
    expect((await fetchUsersAction({})).success).toBe(false);
    mockFetch.mockResolvedValue({ ok: false });
    expect((await fetchUsersAction({})).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await fetchUsersAction({})).success).toBe(false);
  });
  it('create success, no token', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true }));
    expect((await createUserAction({ fullname: 'U', email: 'u@t.com', role: 'user' })).success).toBe(true);
    await noTok();
    expect((await createUserAction({ fullname: 'U', email: 'u@t.com', role: 'user' })).success).toBe(false);
  });
  it('update success', async () => { mockFetch.mockResolvedValue(okJson({ success: true })); expect((await updateUserAction('1', { fullname: 'U' })).success).toBe(true); });
  it('delete success, no token, failure', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true }));
    expect((await deleteUserAction('1')).success).toBe(true);
    await noTok();
    expect((await deleteUserAction('1')).success).toBe(false);
    mockFetch.mockResolvedValue(okJson({ success: false, message: 'Not found' }));
    expect((await deleteUserAction('1')).success).toBe(false);
  });
  it('fetchById success, no token, non-success, HTTP error, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true, data: { email: 'u@t.com' } }));
    expect((await fetchUserByIdAction('1')).success).toBe(true);
    await noTok();
    expect((await fetchUserByIdAction('1')).success).toBe(false);
    mockFetch.mockResolvedValue(okJson({ success: false }));
    expect((await fetchUserByIdAction('1')).success).toBe(false);
    mockFetch.mockResolvedValue({ ok: false });
    expect((await fetchUserByIdAction('1')).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await fetchUserByIdAction('1')).success).toBe(false);
  });
  it('fetchBusinessAccounts success, no token, non-success, HTTP error, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true, data: [] }));
    expect((await fetchBusinessAccountsAction({})).success).toBe(true);
    await noTok();
    expect((await fetchBusinessAccountsAction({})).success).toBe(false);
    mockFetch.mockResolvedValue(okJson({ success: false }));
    expect((await fetchBusinessAccountsAction({})).success).toBe(false);
    mockFetch.mockResolvedValue({ ok: false });
    expect((await fetchBusinessAccountsAction({})).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await fetchBusinessAccountsAction({})).success).toBe(false);
  });
  it('updateStatus success, no token, failure, error', async () => {
    mockFetch.mockResolvedValue(okJson({ success: true }));
    expect((await updateBusinessAccountStatusAction('1', 'approved')).success).toBe(true);
    await noTok();
    expect((await updateBusinessAccountStatusAction('1', 'approved')).success).toBe(false);
    mockFetch.mockResolvedValue(okJson({ success: false }));
    expect((await updateBusinessAccountStatusAction('1', 'rejected')).success).toBe(false);
    mockFetch.mockRejectedValue(new Error('Net'));
    expect((await updateBusinessAccountStatusAction('1', 'approved')).success).toBe(false);
  });
});

describe('Cookies', () => {
  it('getTokenCookie', async () => { expect(await getTokenCookie()).toBe('test-token-123'); });
  it('getUserInfoCookie', async () => { expect(await getUserInfoCookie()).toEqual({ email: 't@t.com', fullname: 'Test' }); });
  it('setTokenCookie', async () => {
    const mockSet = jest.fn();
    jest.mocked(require('next/headers').cookies).mockResolvedValueOnce({ get: jest.fn(), set: mockSet, delete: jest.fn() } as any);
    await setTokenCookie('tok');
    expect(mockSet).toHaveBeenCalledWith('auth_token', 'tok', expect.objectContaining({ path: '/' }));
  });
  it('clearAuthCookies', async () => {
    const mockDel = jest.fn();
    jest.mocked(require('next/headers').cookies).mockResolvedValueOnce({ get: jest.fn(), set: jest.fn(), delete: mockDel } as any);
    await clearAuthCookies();
    expect(mockDel).toHaveBeenCalledWith('auth_token');
  });
});
