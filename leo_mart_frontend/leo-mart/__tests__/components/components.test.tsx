import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '@/app/_components/ProductCard';
import ThemeToggle from '@/app/_components/ThemeToggle';
import OrderTable from '@/app/admin/orders/_components/OrderTable';
import ProductTable from '@/app/admin/products/_components/ProductTable';
import UserTable from '@/app/admin/users/_components/UserTable';
import QuotationTable from '@/app/admin/quotations/_components/QuotationTable';
import { CartProvider } from '@/lib/context/CartContext';
import { ThemeProvider } from '@/lib/context/ThemeContext';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn(), refresh: jest.fn() }),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
  usePathname: jest.fn().mockReturnValue('/admin'),
}));
jest.mock('@/lib/actions/order-action', () => ({ updateOrderStatusAction: jest.fn().mockResolvedValue({ success: true }) }));
jest.mock('@/lib/actions/product-action', () => ({ deleteProductAction: jest.fn().mockResolvedValue({ success: true }) }));
jest.mock('@/lib/actions/user-action', () => ({ deleteUserAction: jest.fn().mockResolvedValue({ success: true }) }));
jest.mock('@/lib/actions/quotation-action', () => ({ updateQuotationStatusAction: jest.fn().mockResolvedValue({ success: true }) }));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((q: string) => ({ matches: false, media: q, addListener: jest.fn(), removeListener: jest.fn(), addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn() })),
});

const product = { _id: '1', name: 'Apple', price: 250, image: '/img.jpg', category: 'Fruits', brand: 'Org', stockStatus: 'in-stock', description: 'Fresh' };
const order = { _id: '1', customerInfo: { fullname: 'J', email: 'j@t.com', phone: '980' }, shippingAddress: { street: '123', city: 'KTM', district: 'KTM' }, items: [{ name: 'A', price: 500, quantity: 2, image: '/i.jpg' }], totalAmount: 1100, paymentMethod: 'Cash on Delivery', paymentStatus: 'Pending', orderStatus: 'Pending', purchaseOrderId: 'ORD-001', createdAt: new Date().toISOString() };
const user = { _id: '1', fullname: 'J', username: 'j', email: 'j@t.com', role: 'user', createdAt: new Date().toISOString() };
const quote = { _id: '1', companyName: 'Corp', email: 'c@t.com', phone: '980', items: 'Widget', status: 'pending' };

describe('Components', () => {
  it('ProductCard renders', () => {
    render(<CartProvider><ProductCard product={product} /></CartProvider>);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Rs. 250')).toBeInTheDocument();
  });
  it('ThemeToggle renders', () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  it('OrderTable renders', () => {
    render(<OrderTable orders={[order]} total={1} totalPages={1} currentPage={1} pageSize={10} currentStatus="" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });
  it('ProductTable renders', () => {
    render(<ProductTable products={[product]} total={1} totalPages={1} currentPage={1} pageSize={10} initialSearch="" />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });
  it('UserTable renders', () => {
    render(<UserTable users={[user]} total={1} totalPages={1} currentPage={1} pageSize={10} initialSearch="" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });
  it('QuotationTable renders', () => {
    render(<QuotationTable quotations={[quote]} total={1} totalPages={1} currentPage={1} pageSize={10} />);
    expect(screen.getByText('Corp')).toBeInTheDocument();
  });
});
