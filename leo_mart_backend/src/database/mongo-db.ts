import mongoose from "mongoose";
import { MONGODB_URI } from "../config/constant";

export const connectToMongoDB = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is required");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
