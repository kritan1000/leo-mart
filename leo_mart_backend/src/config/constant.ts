import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 8088;
export const MOCK = process.env.MOCK_DB || "mock";
export const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "";

export const SECRET_KEY = process.env.SECRET_KEY || "merosecretjwtkey";
