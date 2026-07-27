import axiosInstance from "./axios_instance";
import { API } from "./endpoints";

export const register = async (data: any) => {
  try {
    const response = await axiosInstance.post(API.AUTH.REGISTER, data);
    return response.data;
    // reponse data -> response ko body
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const login = async (data: any) => {
  try {
    const response = await axiosInstance.post(API.AUTH.LOGIN, data);
    return response.data;
    // reponse data -> response ko body
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const getWhoAmI = async () => {
  try {
    const response = await axiosInstance.get(API.AUTH.WHOAMI);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Fetching user details failed");
  }
};

export const updateProfile = async (formData: FormData) => {
  try {
    const response = await axiosInstance.put(API.AUTH.UPDATE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Updating profile failed");
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axiosInstance.post(API.AUTH.REQUEST_PASSWORD_RESET, { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to send password reset email");
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axiosInstance.post(API.AUTH.RESET_PASSWORD(token), { newPassword });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Password reset failed");
  }
};
