import { ProductMongoRepository } from '../../repositories/product_repository';
import Product from '../../models/product_model';
import { connectTestDB, disconnectTestDB, clearCollections } from '../helpers';

jest.mock('../../utils/email', () => {
  const actual = jest.requireActual('../../utils/email');
  return { ...actual };
});

beforeAll(async () => { await connectTestDB(); });
afterAll(async () => { await disconnectTestDB(); });
afterEach(async () => { await clearCollections(); });

describe('ProductMongoRepository - Price Filtering', () => {
  const repo = new ProductMongoRepository();

  beforeEach(async () => {
    await Product.create([
      { name: 'Cheap', description: 'Cheap item', price: 50, category: 'Cat', brand: 'BrandA', stockStatus: 'in-stock', image: '/c.jpg' },
      { name: 'Mid', description: 'Mid item', price: 200, category: 'Cat', brand: 'BrandA', stockStatus: 'in-stock', image: '/m.jpg' },
      { name: 'Expensive', description: 'Expensive item', price: 500, category: 'Cat', brand: 'BrandB', stockStatus: 'in-stock', image: '/e.jpg' },
    ]);
  });

  it('should filter by minPrice only', async () => {
    const result = await repo.findAllPaginated(1, 10, undefined, undefined, undefined, 100);
    expect(result.data.length).toBe(2);
    expect(result.total).toBe(2);
  });

  it('should filter by maxPrice only', async () => {
    const result = await repo.findAllPaginated(1, 10, undefined, undefined, undefined, undefined, 100);
    expect(result.data.length).toBe(1);
    expect(result.data[0].name).toBe('Cheap');
  });

  it('should filter by both minPrice and maxPrice', async () => {
    const result = await repo.findAllPaginated(1, 10, undefined, undefined, undefined, 100, 300);
    expect(result.data.length).toBe(1);
    expect(result.data[0].name).toBe('Mid');
  });
});

describe('Email Utils - passwordResetEmailTemplate', () => {
  it('should generate password reset email HTML', async () => {
    const { passwordResetEmailTemplate } = await import('../../utils/email');
    const html = passwordResetEmailTemplate('https://example.com/reset/token123');
    expect(html).toContain('Reset Password');
    expect(html).toContain('token123');
    expect(html).toContain('LeoMart');
  });
});
