import type { RefreshResponseDto } from "@repo/dtos/auth";
import { api as authApi } from "@shared/lib/axios";
import { useAuthStore } from "@shared/stores/authStore";
import axios, { AxiosHeaders, type AxiosError, type InternalAxiosRequestConfig } from "axios";

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
  headers: AxiosHeaders;
}

const useAxios = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL!
  });

  // Adds bearer token
  api.interceptors.request.use((config) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  // refreshes access token
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequest;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { data: resBody } = await authApi.get<RefreshResponseDto>("/auth/refresh");
          const { setCredentials } = useAuthStore.getState();
          setCredentials(resBody.data.user, resBody.data.accessToken);

          originalRequest.headers.set("Authorization", `Bearer ${resBody.data.accessToken}`);
          return api(originalRequest);
        } catch {
          useAuthStore.getState().logout();
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export default useAxios;
