import Order, { IOrder } from "../models/order_model";
import Product from "../models/product_model";
import mongoose from "mongoose";

export interface CreateCodOrderInput {
  userId?: string;
  customerInfo: {
    fullname: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    district: string;
    landmark?: string;
    postalCode?: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export class OrderService {
  public async createCodOrder(input: CreateCodOrderInput): Promise<IOrder> {
    const { userId, customerInfo, shippingAddress, items } = input;

    if (!items || items.length === 0) {
      throw new Error("Cart items cannot be empty");
    }

    // Fetch product prices strictly from MongoDB
    const productIds = items.map((i) => i.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    const productMap = new Map();
    dbProducts.forEach((p) => productMap.set(p._id.toString(), p));

    let subtotal = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      const dbProduct = productMap.get(item.productId);
      if (!dbProduct) {
        throw new Error(`Product not found with ID: ${item.productId}`);
      }
      const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const price = dbProduct.price;

      subtotal += price * qty;
      validatedItems.push({
        productId: dbProduct._id,
        name: dbProduct.name,
        price: price,
        quantity: qty,
        image: dbProduct.image,
      });
    }

    const deliveryCharge = 100;
    const discount = 0;
    const totalAmount = subtotal + deliveryCharge - discount;

    const purchaseOrderId = `ORD-COD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newOrder = await Order.create({
      user: userId ? new mongoose.Types.ObjectId(userId) : undefined,
      customerInfo,
      shippingAddress,
      items: validatedItems,
      subtotal,
      deliveryCharge,
      discount,
      totalAmount,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
      orderStatus: "Pending",
      purchaseOrderId,
    });

    return newOrder;
  }

  public async getOrderById(id: string): Promise<IOrder | null> {
    return Order.findById(id);
  }

  public async getOrdersByUser(userId: string): Promise<IOrder[]> {
    return Order.find({ user: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }
}
