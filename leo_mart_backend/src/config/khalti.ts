import dotenv from "dotenv";
dotenv.config();

export const khaltiConfig = {
  secretKey: process.env.KHALTI_SECRET_KEY || "Key 9c1a5b81a8b049d5a7d656bd042b5a1b",
  baseUrl: process.env.KHALTI_BASE_URL || "https://dev.khalti.com",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  get initiateUrl() {
    return `${this.baseUrl}/api/v2/epayment/initiate/`;
  },
  get lookupUrl() {
    return `${this.baseUrl}/api/v2/epayment/lookup/`;
  },
};
