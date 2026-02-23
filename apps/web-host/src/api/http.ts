import axios from "axios";

import { STORAGE_KEYS } from "../constants/storage";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
let refreshingPromise: Promise<string | null> | null = null;

export const http = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
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
    localStorage.setItem(STORAGE_KEYS.token, data.access_token);
    if (data.refresh_token) {
      localStorage.setItem(STORAGE_KEYS.refreshToken, data.refresh_token);
    }
    return data.access_token;
  } catch {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.user);
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
