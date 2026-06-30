"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

export async function fetchUsersAction(params: {
  page?: number;
  size?: number;
  search?: string;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const page = params.page || 1;
    const size = params.size || 10;
    const search = params.search ? encodeURIComponent(params.search) : "";

    const url = `${BACKEND_URL}/api/v1/admin/users?page=${page}&size=${size}&search=${search}`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users");
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
    console.error("fetchUsersAction error:", error);
    return { success: false, message: error.message || "Failed to fetch users" };
  }
}

export async function createUserAction(data: {
  fullname: string;
  email: string;
  role: string;
  password?: string;
  username?: string;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      revalidatePath("/admin/dashboard");
      return { success: true, message: result.message || "User created successfully" };
    }
    // Return detailed validation errors
    const errorMsg = result.errors
      ? result.errors.map((e: any) => e.message).join(", ")
      : result.message || "Failed to create user";
    return { success: false, message: errorMsg };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create user" };
  }
}

export async function updateUserAction(
  id: string,
  data: {
    fullname?: string;
    email?: string;
    role?: string;
    password?: string;
  }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/admin/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      revalidatePath("/admin/dashboard");
      revalidatePath(`/admin/users/${id}/edit`);
      return { success: true, message: result.message || "User updated successfully" };
    }
    const errorMsg = result.errors
      ? result.errors.map((e: any) => e.message).join(", ")
      : result.message || "Failed to update user";
    return { success: false, message: errorMsg };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update user" };
  }
}

export async function deleteUserAction(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    if (result.success) {
      revalidatePath("/admin/dashboard");
      return { success: true, message: result.message || "User deleted successfully" };
    }
    return { success: false, message: result.message || "Failed to delete user" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete user" };
  }
}

export async function fetchUserByIdAction(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/admin/users/${id}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }

    const result = await res.json();
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
      };
    }
    return { success: false, message: result.message || "User not found" };
  } catch (error: any) {
    console.error("fetchUserByIdAction error:", error);
    return { success: false, message: error.message || "Failed to fetch user" };
  }
}
