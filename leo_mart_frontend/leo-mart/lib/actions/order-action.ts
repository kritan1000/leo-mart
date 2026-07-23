"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

export async function createCodOrderAction(data: {
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

    const res = await fetch(`${BACKEND_URL}/api/v1/orders/cod`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await res.json();
    if (result.success && result.order) {
      return {
        success: true,
        message: result.message || "Order placed successfully",
        order: result.order,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to place order",
    };
  } catch (error: any) {
    console.error("createCodOrderAction error:", error);
    return {
      success: false,
      message: error.message || "Network error while placing order",
    };
  }
}

export async function fetchOrderByIdAction(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/orders/${id}`, {
      cache: "no-store",
    });

    const result = await res.json();
    if (result.success && result.order) {
      return {
        success: true,
        order: result.order,
      };
    }

    return {
      success: false,
      message: result.message || "Order not found",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch order",
    };
  }
}
