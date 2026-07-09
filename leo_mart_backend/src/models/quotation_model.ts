import mongoose, { Document, Schema } from "mongoose";

export interface IQuotation extends Document {
  companyName: string;
  email: string;
  phone: string;
  items: string; // List of requested items/quantities
  status: "pending" | "reviewed" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const QuotationSchema: Schema = new Schema<IQuotation>(
  {
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    items: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "reviewed", "completed"],
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuotation>("Quotation", QuotationSchema);
