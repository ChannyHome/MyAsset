import axios from "axios";

const STORAGE_TOKEN_KEY = "myasset.auth.token";
const STORAGE_REFRESH_TOKEN_KEY = "myasset.auth.refresh-token";
const STORAGE_USER_KEY = "myasset.auth.user";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api/v1";
let refreshingPromise: Promise<string | null> | null = null;

export const http = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(STORAGE_REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    return null;
  }
  try {
    const { data } = await axios.post<{
      access_token: string;
      refresh_token?: string | null;
      token_type: string;
    }>(
      `${apiBaseUrl}/auth/refresh`,
      { refresh_token: refreshToken },
      { timeout: 15000 },
    );
    if (!data?.access_token) {
      return null;
    }
    localStorage.setItem(STORAGE_TOKEN_KEY, data.access_token);
    if (data.refresh_token) {
      localStorage.setItem(STORAGE_REFRESH_TOKEN_KEY, data.refresh_token);
    }
    return data.access_token;
  } catch {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_REFRESH_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    return null;
  }
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const responseStatus = error?.response?.status;
    const originalRequest = error?.config as (typeof error.config & { _retry?: boolean }) | undefined;
    if (!originalRequest || responseStatus !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const requestUrl = String(originalRequest.url || "");
    if (
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/signup") ||
      requestUrl.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    if (!refreshingPromise) {
      refreshingPromise = refreshAccessToken().finally(() => {
        refreshingPromise = null;
      });
    }
    const nextAccessToken = await refreshingPromise;
    if (!nextAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers = originalRequest.headers ?? {};
    (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${nextAccessToken}`;
    return http.request(originalRequest);
  },
);
