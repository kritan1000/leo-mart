"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

export async function fetchBlogsAction(params: {
  page?: number;
  size?: number;
  search?: string;
}) {
  try {
    const page = params.page || 1;
    const size = params.size || 10;
    const search = params.search ? encodeURIComponent(params.search) : "";

    const url = `${BACKEND_URL}/api/v1/blogs?page=${page}&size=${size}&search=${search}`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
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
    console.error("fetchBlogsAction error:", error);
    return { success: false, message: error.message || "Failed to fetch blogs" };
  }
}

export async function createBlogAction(data: { title: string; content: string; tags?: string[] }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      revalidatePath("/admin/blogs");
      revalidatePath("/admin/dashboard");
      return { success: true, message: result.message || "Blog created successfully" };
    }
    // Return the detailed error message from backend (e.g. Zod validation issues)
    const errorMsg = result.errors
      ? result.errors.map((e: any) => e.message).join(", ")
      : result.message || "Failed to create blog";
    return { success: false, message: errorMsg };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create blog" };
  }
}

export async function updateBlogAction(
  id: string,
  data: { title?: string; content?: string; tags?: string[] }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/blogs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      revalidatePath("/admin/blogs");
      revalidatePath("/admin/dashboard");
      revalidatePath(`/admin/blogs/${id}`);
      revalidatePath(`/admin/blogs/${id}/edit`);
      return { success: true, message: result.message || "Blog updated successfully" };
    }
    const errorMsg = result.errors
      ? result.errors.map((e: any) => e.message).join(", ")
      : result.message || "Failed to update blog";
    return { success: false, message: errorMsg };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update blog" };
  }
}

export async function deleteBlogAction(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/blogs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    if (result.success) {
      revalidatePath("/admin/blogs");
      revalidatePath("/admin/dashboard");
      return { success: true, message: result.message || "Blog deleted successfully" };
    }
    return { success: false, message: result.message || "Failed to delete blog" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete blog" };
  }
}

export async function fetchBlogByIdAction(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/blogs/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch blog post");
    }

    const result = await res.json();
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
      };
    }
    return { success: false, message: result.message || "Blog not found" };
  } catch (error: any) {
    console.error("fetchBlogByIdAction error:", error);
    return { success: false, message: error.message || "Failed to fetch blog post" };
  }
}

