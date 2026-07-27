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
    price?: number;
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

export async function fetchUserOrdersAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/orders/user`, {
      headers,
      cache: "no-store",
    });

    const result = await res.json();
    if (result.success) {
      return {
        success: true,
        data: result.data || [],
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch orders",
      data: [],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch orders",
      data: [],
    };
  }
}

export async function fetchAllOrdersAction(page: number = 1, size: number = 20, status?: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.set("status", status);

    const res = await fetch(`${BACKEND_URL}/api/v1/orders/admin/all?${params}`, {
      headers,
      cache: "no-store",
    });

    const result = await res.json();
    if (result.success) {
      return {
        success: true,
        data: result.data || [],
        meta: result.meta,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch orders",
      data: [],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch orders",
      data: [],
    };
  }
}

export async function updateOrderStatusAction(id: string, orderStatus: string, paymentStatus?: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/orders/admin/${id}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ orderStatus, paymentStatus }),
    });

    const result = await res.json();
    return {
      success: result.success,
      message: result.message || (result.success ? "Status updated" : "Failed to update"),
      order: result.order,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update order status",
    };
  }
}
