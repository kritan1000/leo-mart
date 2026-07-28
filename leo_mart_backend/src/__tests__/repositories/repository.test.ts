import Product from '../../models/product_model';
import User from '../../models/user_model';
import Blog from '../../models/blog_model';
import Order from '../../models/order_model';
import Quotation from '../../models/quotation_model';
import bcrypt from 'bcryptjs';
import { connectTestDB, disconnectTestDB, clearCollections } from '../helpers';

jest.mock('../../utils/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
  passwordResetEmailTemplate: jest.fn().mockReturnValue('<html></html>'),
}));

beforeAll(async () => { await connectTestDB(); });
afterAll(async () => { await disconnectTestDB(); });
afterEach(async () => { await clearCollections(); });

describe('Product Repository', () => {
  it('should filter products by brand', async () => {
    await Product.create([
      { name: 'A', description: 'Desc A', price: 100, category: 'Cat', brand: 'BrandA', stockStatus: 'in-stock', image: '/a.jpg' },
      { name: 'B', description: 'Desc B', price: 200, category: 'Cat', brand: 'BrandB', stockStatus: 'in-stock', image: '/b.jpg' },
    ]);
    const query = { brand: 'BrandA' };
    const total = await Product.countDocuments(query);
    const data = await Product.find(query);
    expect(total).toBe(1);
    expect(data[0].brand).toBe('BrandA');
  });

  it('should filter products by price range', async () => {
    await Product.create([
      { name: 'Cheap', description: 'Cheap item', price: 50, category: 'Cat', brand: 'Brand', stockStatus: 'in-stock', image: '/c.jpg' },
      { name: 'Expensive', description: 'Expensive item', price: 500, category: 'Cat', brand: 'Brand', stockStatus: 'in-stock', image: '/e.jpg' },
    ]);
    const query = { price: { $gte: 100, $lte: 600 } };
    const data = await Product.find(query);
    expect(data.length).toBe(1);
    expect(data[0].name).toBe('Expensive');
  });
});

describe('User Repository', () => {
  it('should find user by reset token', async () => {
    await User.create({
      username: 'resetuser',
      email: 'reset@test.com',
      password: await bcrypt.hash('pass123', 10),
      fullname: 'Reset User',
      passwordResetToken: 'valid-token-hash',
      passwordResetExpires: new Date(Date.now() + 3600000),
    });
    const user = await User.findOne({
      passwordResetToken: 'valid-token-hash',
      passwordResetExpires: { $gt: Date.now() },
    });
    expect(user).toBeDefined();
    expect(user!.email).toBe('reset@test.com');
  });

  it('should not find user with expired reset token', async () => {
    await User.create({
      username: 'expireduser',
      email: 'expired@test.com',
      password: await bcrypt.hash('pass123', 10),
      fullname: 'Expired User',
      passwordResetToken: 'expired-token-hash',
      passwordResetExpires: new Date(Date.now() - 3600000),
    });
    const user = await User.findOne({
      passwordResetToken: 'expired-token-hash',
      passwordResetExpires: { $gt: Date.now() },
    });
    expect(user).toBeNull();
  });

  it('should find business accounts', async () => {
    await User.create([
      {
        username: 'biz1', email: 'biz1@test.com', password: await bcrypt.hash('pass123', 10),
        fullname: 'Biz 1', businessAccount: { status: 'pending', businessName: 'Biz 1' },
      },
      {
        username: 'biz2', email: 'biz2@test.com', password: await bcrypt.hash('pass123', 10),
        fullname: 'Biz 2', businessAccount: { status: 'none' },
      },
    ]);
    const data = await User.find({ 'businessAccount.status': { $ne: 'none' } });
    expect(data.length).toBe(1);
    expect(data[0].username).toBe('biz1');
  });

  it('should find all users', async () => {
    await User.create([
      { username: 'u1', email: 'u1@test.com', password: await bcrypt.hash('pass123', 10), fullname: 'U1' },
      { username: 'u2', email: 'u2@test.com', password: await bcrypt.hash('pass123', 10), fullname: 'U2' },
    ]);
    const users = await User.find();
    expect(users.length).toBe(2);
  });

  it('should find users paginated with search', async () => {
    await User.create([
      { username: 'alice', email: 'alice@test.com', password: await bcrypt.hash('pass123', 10), fullname: 'Alice' },
      { username: 'bob', email: 'bob@test.com', password: await bcrypt.hash('pass123', 10), fullname: 'Bob' },
    ]);
    const query = { $or: [{ fullname: { $regex: 'alice', $options: 'i' } }] };
    const total = await User.countDocuments(query);
    const data = await User.find(query).skip(0).limit(10);
    expect(total).toBe(1);
    expect(data[0].username).toBe('alice');
  });

  it('should find business accounts with status filter', async () => {
    await User.create([
      {
        username: 'bizpending', email: 'bizp@test.com', password: await bcrypt.hash('pass123', 10),
        fullname: 'Biz Pending', businessAccount: { status: 'pending', businessName: 'Biz P' },
      },
      {
        username: 'bizapproved', email: 'biza@test.com', password: await bcrypt.hash('pass123', 10),
        fullname: 'Biz Approved', businessAccount: { status: 'approved', businessName: 'Biz A' },
      },
    ]);
    const query: any = { 'businessAccount.status': { $ne: 'none' } };
    query['businessAccount.status'] = 'pending';
    const data = await User.find(query);
    expect(data.length).toBe(1);
    expect(data[0].username).toBe('bizpending');
  });
});

describe('Blog Repository', () => {
  it('should populate author on find', async () => {
    const user = await User.create({
      username: 'blogauthor', email: 'author@test.com',
      password: await bcrypt.hash('pass123', 10), fullname: 'Author',
    });
    const blog = await Blog.create({
      title: 'Test Blog', content: 'Blog content here', author: user._id,
    });
    const found = await Blog.findById(blog._id).populate('author', 'fullname email');
    expect(found).toBeDefined();
    expect((found!.author as any).fullname).toBe('Author');
  });
});

describe('Order Repository', () => {
  it('should find orders by user', async () => {
    const user = await User.create({
      username: 'orderuser', email: 'order@test.com',
      password: await bcrypt.hash('pass123', 10), fullname: 'Order User',
    });
    await Order.create({
      user: user._id, customerInfo: { fullname: 'Test', email: 't@t.com', phone: '9800000000' },
      shippingAddress: { street: '123', city: 'KTM', district: 'KTM' },
      items: [], subtotal: 0, deliveryCharge: 100, discount: 0, totalAmount: 100,
      paymentMethod: 'Cash on Delivery', paymentStatus: 'Pending', orderStatus: 'Pending',
    });
    const orders = await Order.find({ user: user._id });
    expect(orders.length).toBe(1);
  });

  it('should update order status', async () => {
    const order = await Order.create({
      customerInfo: { fullname: 'Test', email: 't@t.com', phone: '9800000000' },
      shippingAddress: { street: '123', city: 'KTM', district: 'KTM' },
      items: [], subtotal: 0, deliveryCharge: 100, discount: 0, totalAmount: 100,
      paymentMethod: 'Cash on Delivery', paymentStatus: 'Pending', orderStatus: 'Pending',
    });
    const updated = await Order.findByIdAndUpdate(order._id, { orderStatus: 'Shipped' }, { new: true });
    expect(updated!.orderStatus).toBe('Shipped');
  });
});

describe('Quotation Repository', () => {
  it('should update quotation status', async () => {
    const q = await Quotation.create({
      companyName: 'Test Corp', email: 'test@corp.com', phone: '9800000000', items: 'Widget',
    });
    const updated = await Quotation.findByIdAndUpdate(q._id, { status: 'completed' }, { new: true });
    expect(updated!.status).toBe('completed');
  });

  it('should paginate quotations', async () => {
    for (let i = 0; i < 5; i++) {
      await Quotation.create({ companyName: `Corp ${i}`, email: `${i}@c.com`, phone: '9800000000', items: `Item ${i}` });
    }
    const total = await Quotation.countDocuments();
    const data = await Quotation.find().skip(0).limit(2);
    expect(total).toBe(5);
    expect(data.length).toBe(2);
  });
});
