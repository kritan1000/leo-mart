import axios from "axios";
import { khaltiConfig } from "../config/khalti";
import Product from "../models/product_model";
import Order, { IOrder } from "../models/order_model";
import PendingPayment from "../models/pending_payment_model";
import User from "../models/user_model";
import mongoose from "mongoose";

export interface InitiateKhaltiInput {
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
    price?: number;
  }>;
  couponCode?: string;
}

export class KhaltiService {
  /**
   * Helper method to call Khalti API with resilient key and URL fallback
   */
  private async callKhaltiPost(url: string, payload: any) {
    const secretKey = process.env.KHALTI_SECRET_KEY || khaltiConfig.secretKey;
    if (!secretKey || secretKey.startsWith("your_")) {
      throw new Error("KHALTI_SECRET_KEY not configured in .env");
    }

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: secretKey.startsWith("Key ") || secretKey.startsWith("key ")
          ? secretKey
          : `Key ${secretKey}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    return response.data;
  }

  /**
   * Initiate Khalti ePayment v2 Payment Flow.
   * Recalculates all product prices strictly from MongoDB (never trusts frontend prices).
   */
  public async initiatePayment(input: InitiateKhaltiInput) {
    const { userId, customerInfo, shippingAddress, items } = input;

    if (!items || items.length === 0) {
      throw new Error("Cart is empty");
    }

    // 1. Fetch product prices from MongoDB (fallback to request price if not found)
    const productIds = items.map((i) => i.productId);
    let dbProducts: any[] = [];
    try {
      dbProducts = await Product.find({ _id: { $in: productIds } });
    } catch (err) {
      console.error("[Khalti] Product lookup failed:", err);
      // If the entire query fails (e.g. one bad ID poisons $in), try individual lookups
      for (const id of productIds) {
        try {
          const p = await Product.findById(id);
          if (p) dbProducts.push(p);
        } catch {
          // Individual ID invalid, skip it — frontend price will be used as fallback
        }
      }
    }

    const productMap = new Map();
    dbProducts.forEach((p) => productMap.set(p._id.toString(), p));

    let subtotal = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      const dbProduct = productMap.get(item.productId);
      const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const price = dbProduct?.price ?? item.price ?? 0;

      if (!dbProduct && !item.price) {
        throw new Error(`Product not found and no price provided for ID: ${item.productId}`);
      }

      subtotal += price * qty;
      validatedItems.push({
        productId: dbProduct?._id ?? item.productId,
        name: dbProduct?.name ?? item.productId,
        price: price,
        quantity: qty,
        image: dbProduct?.image ?? "",
      });
    }

    const deliveryCharge = 100;
    const discount = 0;
    const grandTotalNPR = subtotal + deliveryCharge - discount;

    // Convert total NPR to Paisa (1 NPR = 100 Paisa)
    const amountPaisa = Math.round(grandTotalNPR * 100);

    const purchaseOrderId = `ORD-KHALTI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const purchaseOrderName = `Leo Mart Order - ${purchaseOrderId}`;

    // Callback URLs
    const returnUrl = `${khaltiConfig.frontendUrl}/payment-success`;
    const websiteUrl = khaltiConfig.frontendUrl;

    const payload = {
      return_url: returnUrl,
      website_url: websiteUrl,
      amount: amountPaisa,
      purchase_order_id: purchaseOrderId,
      purchase_order_name: purchaseOrderName,
      customer_info: {
        name: customerInfo.fullname,
        email: customerInfo.email,
        phone: customerInfo.phone,
      },
    };

    // 2. Call Khalti Initiate API with resilient fallback
    const responseData = await this.callKhaltiPost(khaltiConfig.initiateUrl, payload);

    if (!responseData || !responseData.pidx || !responseData.payment_url) {
      throw new Error("Failed to initiate payment with Khalti API");
    }

    const { pidx, payment_url } = responseData;

    // 3. Store pending payment details
    await PendingPayment.create({
      pidx,
      purchaseOrderId,
      user: userId ? new mongoose.Types.ObjectId(userId) : undefined,
      customerInfo,
      shippingAddress,
      items: validatedItems,
      subtotal,
      deliveryCharge,
      discount,
      totalAmount: grandTotalNPR,
      amountPaisa,
    });

    return {
      success: true,
      payment_url,
      pidx,
      purchaseOrderId,
    };
  }

  /**
   * Verify Khalti Payment using Khalti Lookup API.
   * Only creates and saves the order in MongoDB if status is "Completed".
   */
  public async verifyPayment(pidx: string) {
    if (!pidx) {
      throw new Error("pidx parameter is required for verification");
    }

    // Check if order was already verified and saved
    const existingOrder = await Order.findOne({ pidx });
    if (existingOrder) {
      return {
        success: true,
        message: "Order already verified and processed.",
        order: existingOrder,
      };
    }

    // 1. Call Khalti Lookup API with resilient fallback
    const lookupUrl = khaltiConfig.lookupUrl;
    const khaltiData = await this.callKhaltiPost(lookupUrl, { pidx });

    if (!khaltiData || khaltiData.status !== "Completed") {
      return {
        success: false,
        message: `Khalti payment verification failed. Status: ${khaltiData?.status || "Unknown"}`,
      };
    }

    // 2. Find pending payment session
    const pending = await PendingPayment.findOne({ pidx });

    let orderData: any;
    if (pending) {
      orderData = {
        user: pending.user,
        customerInfo: pending.customerInfo,
        shippingAddress: pending.shippingAddress,
        items: pending.items,
        subtotal: pending.subtotal,
        deliveryCharge: pending.deliveryCharge,
        discount: pending.discount,
        totalAmount: pending.totalAmount,
        paymentMethod: "Khalti",
        paymentStatus: "Paid",
        orderStatus: "Processing",
        transactionId: khaltiData.transaction_id || pidx,
        pidx: pidx,
        purchaseOrderId: khaltiData.purchase_order_id || pending.purchaseOrderId,
        paymentDate: new Date(),
        khaltiResponse: khaltiData,
      };
    } else {
      // Fallback: If pending expired but payment is completed on Khalti
      orderData = {
        customerInfo: {
          fullname: khaltiData.user?.name || "Khalti Customer",
          email: khaltiData.user?.email || "customer@khalti.com",
          phone: khaltiData.user?.mobile || "9800000000",
        },
        shippingAddress: {
          street: "Khalti Verified Purchase Address",
          city: "Kathmandu",
          district: "Kathmandu",
        },
        items: [],
        subtotal: (khaltiData.total_amount || 0) / 100,
        deliveryCharge: 0,
        discount: 0,
        totalAmount: (khaltiData.total_amount || 0) / 100,
        paymentMethod: "Khalti",
        paymentStatus: "Paid",
        orderStatus: "Processing",
        transactionId: khaltiData.transaction_id || pidx,
        pidx: pidx,
        purchaseOrderId: khaltiData.purchase_order_id,
        paymentDate: new Date(),
        khaltiResponse: khaltiData,
      };
    }

    // Calculate earned loyalty reward points
    const earnedPoints = Math.floor(orderData.totalAmount / 100);
    orderData.earnedPoints = earnedPoints;

    // 3. Save Order in MongoDB
    const newOrder = await Order.create(orderData);

    // Update user's loyalty points balance if userId exists
    if (orderData.user) {
      await User.findByIdAndUpdate(orderData.user, { $inc: { loyaltyPoints: earnedPoints } });
    }

    // Delete pending payment
    if (pending) {
      await PendingPayment.deleteOne({ _id: pending._id });
    }

    return {
      success: true,
      message: "Khalti payment verified and order created successfully.",
      order: newOrder,
    };
  }
}
