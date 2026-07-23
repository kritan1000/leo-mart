import dotenv from "dotenv";
dotenv.config();

export const khaltiConfig = {
  secretKey: process.env.KHALTI_SECRET_KEY || "Key test_secret_key_f59e8b32620241f992c5484087e02b70",
  baseUrl: process.env.KHALTI_BASE_URL || "https://dev.khalti.com",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  get initiateUrl() {
    return `${this.baseUrl}/api/v2/epayment/initiate/`;
  },
  get lookupUrl() {
    return `${this.baseUrl}/api/v2/epayment/lookup/`;
  },
};
