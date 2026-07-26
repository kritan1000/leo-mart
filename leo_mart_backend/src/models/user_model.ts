import mongoose, { Document, Schema } from "mongoose";
import { UserType } from "../types/user_type";

export interface IUser extends UserType, Document {
  _id: mongoose.Types.ObjectId;
  profilePicture: string;
  loyaltyPoints: number;
  businessAccount?: {
    status: "none" | "pending" | "approved" | "rejected";
    businessName?: string;
    registrationNo?: string;
    businessType?: string;
    appliedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserModelSchema: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fullname: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    profilePicture: { type: String, default: "" },
    loyaltyPoints: { type: Number, default: 0 },
    businessAccount: {
      status: {
        type: String,
        enum: ["none", "pending", "approved", "rejected"],
        default: "none",
      },
      businessName: { type: String },
      registrationNo: { type: String },
      businessType: { type: String },
      appliedAt: { type: Date },
    },
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

export default mongoose.model<IUser>("User", UserModelSchema);
