import mongoose, { Document, Schema } from "mongoose";
import { ICustomerInfo, IShippingAddress, IOrderItem } from "./order_model";

export interface IPendingPayment extends Document {
  pidx: string;
  purchaseOrderId: string;
  user?: mongoose.Types.ObjectId;
  customerInfo: ICustomerInfo;
  shippingAddress: IShippingAddress;
  items: IOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number; // in NPR
  amountPaisa: number; // in Paisa for Khalti
  createdAt: Date;
}

const PendingPaymentSchema: Schema = new Schema<IPendingPayment>(
  {
    pidx: { type: String, required: true, unique: true },
    purchaseOrderId: { type: String, required: true },
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
    deliveryCharge: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    amountPaisa: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Expire pending payments after 1 hour automatically
PendingPaymentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

export default mongoose.model<IPendingPayment>("PendingPayment", PendingPaymentSchema);
