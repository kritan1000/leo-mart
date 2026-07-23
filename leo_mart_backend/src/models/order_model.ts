import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IShippingAddress {
  street: string;
  city: string;
  district: string;
  landmark?: string;
  postalCode?: string;
}

export interface ICustomerInfo {
  fullname: string;
  email: string;
  phone: string;
}

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId;
  customerInfo: ICustomerInfo;
  shippingAddress: IShippingAddress;
  items: IOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  paymentMethod: "Cash on Delivery" | "Khalti";
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Pending" | "Processing" | "Delivered" | "Cancelled";
  transactionId?: string;
  pidx?: string;
  purchaseOrderId?: string;
  paymentDate?: Date;
  khaltiResponse?: any;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    customerInfo: {
      fullname: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      landmark: { type: String },
      postalCode: { type: String },
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true, default: 100 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Khalti"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Pending",
      required: true,
    },
    transactionId: { type: String },
    pidx: { type: String, index: true },
    purchaseOrderId: { type: String },
    paymentDate: { type: Date },
    khaltiResponse: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
