"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

export async function initiateKhaltiAction(data: {
  customerInfo: {
    fullname: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    district: string;
    landmark?: string;
    postalCode?: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  couponCode?: string;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/payment/khalti/initiate`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await res.json();
    if (result.success && result.payment_url) {
      return {
        success: true,
        payment_url: result.payment_url,
        pidx: result.pidx,
        purchaseOrderId: result.purchaseOrderId,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to initiate Khalti payment",
    };
  } catch (error: any) {
    console.error("initiateKhaltiAction error:", error);
    return {
      success: false,
      message: error.message || "Network error while initiating payment",
    };
  }
}

export async function verifyKhaltiAction(pidx: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/payment/khalti/verify`, {
      method: "POST",
      headers,
      body: JSON.stringify({ pidx }),
      cache: "no-store",
    });

    const result = await res.json();
    if (result.success) {
      return {
        success: true,
        message: result.message || "Payment verified successfully",
        order: result.order,
      };
    }

    return {
      success: false,
      message: result.message || "Khalti payment verification failed",
    };
  } catch (error: any) {
    console.error("verifyKhaltiAction error:", error);
    return {
      success: false,
      message: error.message || "Failed to verify Khalti payment",
    };
  }
}
