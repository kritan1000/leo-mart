export const API = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    WHOAMI: "/api/v1/auth/whoami",
    UPDATE: "/api/v1/auth/update",
    REQUEST_PASSWORD_RESET: "/api/v1/auth/request-password-reset",
    RESET_PASSWORD: (token: string) => `/api/v1/auth/reset-password/${token}`,
  },
};
