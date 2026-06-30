import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  image?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogModelSchema: Schema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, required: false },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IBlog>("Blog", BlogModelSchema);
