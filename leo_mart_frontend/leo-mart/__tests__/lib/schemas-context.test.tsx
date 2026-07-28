import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { loginSchema, registerSchema } from '@/app/(auth)/_components/schema';
import { LoginSchema, RegisterSchema } from '@/lib/schemas/auth.schema';
import { AuthProvider, useAuth } from '../../lib/context/AuthContext';
import { CartProvider, useCart } from '../../lib/context/CartContext';
import { ThemeProvider, useTheme } from '../../lib/context/ThemeContext';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false, media: query, onchange: null,
    addListener: jest.fn(), removeListener: jest.fn(),
    addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn(),
  })),
});

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('../../lib/api/auth', () => ({ getWhoAmI: jest.fn() }));
jest.mock('../../lib/cookies', () => ({ clearAuthCookies: jest.fn().mockResolvedValue(undefined) }));
const { getWhoAmI } = require('../../lib/api/auth');

beforeEach(() => { jest.clearAllMocks(); Object.defineProperty(document, 'cookie', { writable: true, value: '' }); localStorage.clear(); });

describe('Schemas', () => {
  it('loginSchema validates', () => expect(loginSchema.safeParse({ email: 't@t.com', password: 'pass123' }).success).toBe(true));
  it('loginSchema rejects', () => expect(loginSchema.safeParse({ email: 'bad', password: '12345' }).success).toBe(false));
  it('registerSchema validates', () => expect(registerSchema.safeParse({ fullName: 'John', email: 'j@t.com', password: 'pass123', confirmPassword: 'pass123' }).success).toBe(true));
  it('LoginSchema validates', () => expect(LoginSchema.safeParse({ email: 't@t.com', password: 'pass123' }).success).toBe(true));
  it('RegisterSchema validates', () => expect(RegisterSchema.safeParse({ firstName: 'Jo', lastName: 'Do', email: 'j@t.com', password: 'pass123', confirmPassword: 'pass123' }).success).toBe(true));
  it('RegisterSchema rejects', () => expect(RegisterSchema.safeParse({ firstName: 'J', lastName: 'Do', email: 'j@t.com', password: 'pass123', confirmPassword: 'pass123' }).success).toBe(false));
});

describe('AuthContext', () => {
  function TestComp() {
    const { isAuthenticated, user, loading, logout } = useAuth();
    return <div><span data-testid="auth">{isAuthenticated ? 'true' : 'false'}</span><button onClick={logout}>Logout</button></div>;
  }
  const renderAuth = () => render(<AuthProvider><TestComp /></AuthProvider>);

  it('starts unauthenticated', async () => { getWhoAmI.mockRejectedValue(new Error('No token')); await act(async () => { renderAuth(); }); expect(screen.getByTestId('auth').textContent).toBe('false'); });
  it('authenticates with valid token', async () => { Object.defineProperty(document, 'cookie', { writable: true, value: 'auth_token=valid' }); getWhoAmI.mockResolvedValue({ success: true, data: { email: 'u@t.com' } }); await act(async () => { renderAuth(); }); expect(screen.getByTestId('auth').textContent).toBe('true'); });
  it('logs out', async () => { Object.defineProperty(document, 'cookie', { writable: true, value: 'auth_token=valid' }); getWhoAmI.mockResolvedValue({ success: true, data: { email: 'u@t.com' } }); await act(async () => { renderAuth(); }); await act(async () => { screen.getByText('Logout').click(); }); expect(screen.getByTestId('auth').textContent).toBe('false'); });
});

describe('CartContext', () => {
  function TestComp() {
    const { cart, addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount } = useCart();
    return (
      <div>
        <span data-testid="count">{cartCount}</span><span data-testid="total">{cartTotal}</span>
        <button onClick={() => addToCart({ _id: '1', name: 'A', price: 100 }, 2)}>Add</button>
        <button onClick={() => removeFromCart('1')}>Remove</button>
        <button onClick={() => updateCartQty('1', 1)}>Inc</button>
        <button onClick={clearCart}>Clear</button>
      </div>
    );
  }
  const renderCart = () => render(<CartProvider><TestComp /></CartProvider>);

  it('manages cart', () => { renderCart(); expect(screen.getByTestId('count').textContent).toBe('0'); act(() => screen.getByText('Add').click()); expect(screen.getByTestId('total').textContent).toBe('200'); act(() => screen.getByText('Inc').click()); expect(screen.getByTestId('total').textContent).toBe('300'); act(() => screen.getByText('Remove').click()); expect(screen.getByTestId('count').textContent).toBe('0'); });
  it('clears cart', () => { renderCart(); act(() => screen.getByText('Add').click()); act(() => screen.getByText('Clear').click()); expect(screen.getByTestId('count').textContent).toBe('0'); });
});

describe('ThemeContext', () => {
  function TestComp() {
    const { theme, toggleTheme } = useTheme();
    return <div><span data-testid="theme">{theme}</span><button onClick={toggleTheme}>Toggle</button></div>;
  }
  const renderTheme = () => render(<ThemeProvider><TestComp /></ThemeProvider>);

  it('defaults to light', () => { renderTheme(); expect(screen.getByTestId('theme').textContent).toBe('light'); });
  it('toggles theme', () => { renderTheme(); act(() => screen.getByText('Toggle').click()); expect(screen.getByTestId('theme').textContent).toBe('dark'); });
});
