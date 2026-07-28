import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaymentFailedPage from '@/app/payment-failed/page';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn((key: string) => {
      if (key === 'reason') return 'Payment%20was%20cancelled';
      return null;
    }),
  }),
}));

jest.mock('@/app/(auth)/_components/type/AuthComponent', () => ({
  LeoMartLogo: () => <div data-testid="logo">LeoMart</div>,
}));

describe('PaymentFailedPage', () => {
  it('should render payment failed page', () => {
    render(<PaymentFailedPage />);
    expect(screen.getByText('Payment Failed')).toBeInTheDocument();
  });

  it('should display retry payment link', () => {
    render(<PaymentFailedPage />);
    expect(screen.getByText('Retry Payment')).toHaveAttribute('href', '/checkout');
  });

  it('should display return to store link', () => {
    render(<PaymentFailedPage />);
    expect(screen.getByText('Return to Store')).toHaveAttribute('href', '/groceries');
  });

  it('should render LeoMart logo', () => {
    render(<PaymentFailedPage />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });
});
