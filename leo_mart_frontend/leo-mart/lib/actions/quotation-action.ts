"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

export async function submitQuotationAction(data: {
  companyName: string;
  email: string;
  phone: string;
  items: string;
}) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/quotations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      revalidatePath("/admin/dashboard");
      return { success: true, message: result.message || "Quotation submitted successfully" };
    }
    const errorMsg = result.errors
      ? result.errors.map((e: any) => e.message).join(", ")
      : result.message || "Failed to submit quotation";
    return { success: false, message: errorMsg };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to submit quotation" };
  }
}

export async function fetchQuotationsAction(params: { page?: number; size?: number }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const page = params.page || 1;
    const size = params.size || 10;

    const res = await fetch(`${BACKEND_URL}/api/v1/quotations?page=${page}&size=${size}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch quotations");
    }

    const result = await res.json();
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
      };
    }
    return { success: false, data: { data: [], total: 0, totalPages: 0, page, size } };
  } catch (error: any) {
    console.error("fetchQuotationsAction error:", error);
    return { success: false, message: error.message || "Failed to fetch quotations" };
  }
}

export async function updateQuotationStatusAction(
  id: string,
  status: "pending" | "reviewed" | "completed"
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/quotations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const result = await res.json();
    if (result.success) {
      revalidatePath("/admin/dashboard");
      return { success: true, message: result.message || "Quotation status updated successfully" };
    }
    return { success: false, message: result.message || "Failed to update quotation status" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update quotation status" };
  }
}
