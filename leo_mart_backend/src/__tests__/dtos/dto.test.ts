import { CreateUserDto, LoginUserDto, AdminCreateUserDto, AdminUpdateUserDto } from '../../dtos/user_dto';
import { CreateProductDto, UpdateProductDto } from '../../dtos/product_dto';
import { CreateBlogDto, UpdateBlogDto } from '../../dtos/blog_dto';
import { CreateQuotationDto } from '../../dtos/quotation_dto';

describe('User DTOs', () => {
  describe('CreateUserDto', () => {
    it('should validate correct user data', () => {
      const result = CreateUserDto.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = CreateUserDto.safeParse({ email: 'bad', password: 'password123' });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = CreateUserDto.safeParse({ email: 'test@example.com', password: '12345' });
      expect(result.success).toBe(false);
    });

    it('should accept optional fields', () => {
      const result = CreateUserDto.safeParse({
        fullname: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('LoginUserDto', () => {
    it('should validate correct login data', () => {
      const result = LoginUserDto.safeParse({ email: 'test@example.com', password: 'password123' });
      expect(result.success).toBe(true);
    });

    it('should reject missing email', () => {
      const result = LoginUserDto.safeParse({ password: 'password123' });
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const result = LoginUserDto.safeParse({ email: 'test@example.com' });
      expect(result.success).toBe(false);
    });
  });

  describe('AdminCreateUserDto', () => {
    it('should validate correct admin create data', () => {
      const result = AdminCreateUserDto.safeParse({
        fullname: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      });
      expect(result.success).toBe(true);
    });

    it('should default role to user', () => {
      const result = AdminCreateUserDto.safeParse({
        fullname: 'Regular User',
        email: 'user@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.role).toBe('user');
    });

    it('should reject short fullname', () => {
      const result = AdminCreateUserDto.safeParse({
        fullname: 'AB',
        email: 'user@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('AdminUpdateUserDto', () => {
    it('should validate partial update', () => {
      const result = AdminUpdateUserDto.safeParse({ fullname: 'Updated Name' });
      expect(result.success).toBe(true);
    });

    it('should accept role update', () => {
      const result = AdminUpdateUserDto.safeParse({ role: 'admin' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid role', () => {
      const result = AdminUpdateUserDto.safeParse({ role: 'superadmin' });
      expect(result.success).toBe(false);
    });
  });
});

describe('Product DTOs', () => {
  describe('CreateProductDto', () => {
    it('should validate correct product data', () => {
      const result = CreateProductDto.safeParse({
        name: 'Test Product',
        description: 'A test product',
        price: 100,
        category: 'Electronics',
        brand: 'TestBrand',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const result = CreateProductDto.safeParse({
        name: '',
        description: 'A test product',
        price: 100,
        category: 'Electronics',
        brand: 'TestBrand',
      });
      expect(result.success).toBe(false);
    });

    it('should reject price of 0', () => {
      const result = CreateProductDto.safeParse({
        name: 'Test Product',
        description: 'A test product',
        price: 0,
        category: 'Electronics',
        brand: 'TestBrand',
      });
      expect(result.success).toBe(false);
    });

    it('should default stockStatus to in-stock', () => {
      const result = CreateProductDto.safeParse({
        name: 'Test Product',
        description: 'A test product',
        price: 100,
        category: 'Electronics',
        brand: 'TestBrand',
      });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.stockStatus).toBe('in-stock');
    });
  });

  describe('UpdateProductDto', () => {
    it('should validate partial update', () => {
      const result = UpdateProductDto.safeParse({ name: 'Updated Name' });
      expect(result.success).toBe(true);
    });

    it('should accept valid stockStatus', () => {
      const result = UpdateProductDto.safeParse({ stockStatus: 'low-stock' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid stockStatus', () => {
      const result = UpdateProductDto.safeParse({ stockStatus: 'out-of-stock' });
      expect(result.success).toBe(false);
    });
  });
});

describe('Blog DTOs', () => {
  describe('CreateBlogDto', () => {
    it('should validate correct blog data', () => {
      const result = CreateBlogDto.safeParse({
        title: 'Test Blog',
        content: 'This is blog content that is long enough.',
      });
      expect(result.success).toBe(true);
    });

    it('should reject short title', () => {
      const result = CreateBlogDto.safeParse({ title: 'ab', content: 'Valid content here.' });
      expect(result.success).toBe(false);
    });

    it('should reject short content', () => {
      const result = CreateBlogDto.safeParse({ title: 'Valid Title', content: 'short' });
      expect(result.success).toBe(false);
    });

    it('should accept optional tags', () => {
      const result = CreateBlogDto.safeParse({
        title: 'Test Blog',
        content: 'This is blog content that is long enough.',
        tags: ['tech', 'news'],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('UpdateBlogDto', () => {
    it('should validate partial update', () => {
      const result = UpdateBlogDto.safeParse({ title: 'Updated Title' });
      expect(result.success).toBe(true);
    });

    it('should accept empty object', () => {
      const result = UpdateBlogDto.safeParse({});
      expect(result.success).toBe(true);
    });
  });
});

describe('Quotation DTO', () => {
  describe('CreateQuotationDto', () => {
    it('should validate correct quotation data', () => {
      const result = CreateQuotationDto.safeParse({
        companyName: 'Test Corp',
        email: 'test@corp.com',
        phone: '9800000000',
        items: '10x Widget A',
      });
      expect(result.success).toBe(true);
    });

    it('should reject short company name', () => {
      const result = CreateQuotationDto.safeParse({
        companyName: 'A',
        email: 'test@corp.com',
        phone: '9800000000',
        items: 'Some items',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const result = CreateQuotationDto.safeParse({
        companyName: 'Test Corp',
        email: 'bad-email',
        phone: '9800000000',
        items: 'Some items',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short phone', () => {
      const result = CreateQuotationDto.safeParse({
        companyName: 'Test Corp',
        email: 'test@corp.com',
        phone: '123',
        items: 'Some items',
      });
      expect(result.success).toBe(false);
    });
  });
});
