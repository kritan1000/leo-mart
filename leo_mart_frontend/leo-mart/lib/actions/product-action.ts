"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

export async function fetchProductsAction(params: {
  page?: number;
  size?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  try {
    const page = params.page || 1;
    const size = params.size || 10;
    const search = params.search ? encodeURIComponent(params.search) : "";
    const category = params.category ? encodeURIComponent(params.category) : "";
    const brand = params.brand ? encodeURIComponent(params.brand) : "";

    let url = `${BACKEND_URL}/api/v1/products?page=${page}&size=${size}&search=${search}`;
    if (category) url += `&category=${category}`;
    if (brand) url += `&brand=${brand}`;
    if (params.minPrice !== undefined) url += `&minPrice=${params.minPrice}`;
    if (params.maxPrice !== undefined) url += `&maxPrice=${params.maxPrice}`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
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
    console.error("fetchProductsAction error:", error);
    return { success: false, message: error.message || "Failed to fetch products" };
  }
}

export async function createProductAction(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // Send multipart data directly
    });

    const result = await res.json();
    if (result.success) {
      revalidatePath("/admin/dashboard");
      revalidatePath("/");
      revalidatePath("/groceries");
      revalidatePath("/wholesale");
      return { success: true, message: result.message || "Product created successfully" };
    }
    const errorMsg = result.errors
      ? result.errors.map((e: any) => e.message).join(", ")
      : result.message || "Failed to create product";
    return { success: false, message: errorMsg };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create product" };
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/products/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();
    if (result.success) {
      revalidatePath("/admin/dashboard");
      revalidatePath("/");
      revalidatePath("/groceries");
      revalidatePath("/wholesale");
      return { success: true, message: result.message || "Product updated successfully" };
    }
    const errorMsg = result.errors
      ? result.errors.map((e: any) => e.message).join(", ")
      : result.message || "Failed to update product";
    return { success: false, message: errorMsg };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update product" };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    if (result.success) {
      revalidatePath("/admin/dashboard");
      revalidatePath("/");
      revalidatePath("/groceries");
      revalidatePath("/wholesale");
      return { success: true, message: result.message || "Product deleted successfully" };
    }
    return { success: false, message: result.message || "Failed to delete product" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete product" };
  }
}

export async function fetchProductByIdAction(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }

    const result = await res.json();
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
      };
    }
    return { success: false, message: result.message || "Product not found" };
  } catch (error: any) {
    console.error("fetchProductByIdAction error:", error);
    return { success: false, message: error.message || "Failed to fetch product" };
  }
}
