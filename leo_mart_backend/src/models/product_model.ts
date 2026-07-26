import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  stockStatus: "in-stock" | "bulk-deal" | "low-stock";
  minBulkQty?: number;
  bulkPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    stockStatus: {
      type: String,
      enum: ["in-stock", "bulk-deal", "low-stock"],
      default: "in-stock",
      required: true,
    },
    minBulkQty: { type: Number, default: 0 },
    bulkPrice: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
