import mongoose, { Document, Schema } from "mongoose";
import { UserType } from "../types/user_type";

export interface IUser extends UserType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserModelSchema: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },

    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  {
    timestamps: true, // createdAt and updatedAt
  },
);
export default mongoose.model<IUser>(
  "User", // collection name in db.users
  UserModelSchema,
);
