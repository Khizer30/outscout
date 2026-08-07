import type {
  ForgotPasswordSchema,
  LoginSchema,
  ResetPasswordSchema,
  SignupSchema,
  SwitchCompanySchema,
  VerifyUserSchema,
  ForgotPasswordResponseSchema,
  LoginResponseSchema,
  LogoutResponseSchema,
  MeResponseSchema,
  RefreshResponseSchema,
  ResetPasswordResponseSchema,
  SignupResponseSchema,
  SwitchCompanyResponseSchema,
  VerifyUserResponseSchema
} from "@repo/dtos/auth";
import useAxios from "@shared/hooks/useAxios";
import { api } from "@shared/lib/axios";
import { useAuthStore } from "@shared/stores/authStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { z } from "zod";

// Signup
export const useSignup = () =>
  useMutation({
    mutationFn: async (data: z.infer<typeof SignupSchema>) => {
      const res = await api.post<z.infer<typeof SignupResponseSchema>>("/auth/signup", data);
      return res.data;
    }
  });

// Verify User
export const useVerifyUser = () =>
  useMutation({
    mutationFn: async (data: z.infer<typeof VerifyUserSchema>) => {
      const res = await api.post<z.infer<typeof VerifyUserResponseSchema>>("/auth/verify", data);
      return res.data;
    }
  });

// Login
export const useLogin = () =>
  useMutation({
    mutationFn: async (data: z.infer<typeof LoginSchema>) => {
      const res = await api.post<z.infer<typeof LoginResponseSchema>>("/auth/login", data);
      return res.data;
    },
    onSuccess: (res) => {
      useAuthStore.getState().setCredentials(res.data.user, res.data.accessToken);
    }
  });

// Logout
export const useLogout = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async () => {
      const res = await axios.post<z.infer<typeof LogoutResponseSchema>>("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      useAuthStore.getState().logout();
    }
  });
};

// Refresh
export const useRefresh = () =>
  useMutation({
    mutationFn: async () => {
      const res = await api.post<z.infer<typeof RefreshResponseSchema>>("/auth/refresh");
      return res.data;
    },
    onSuccess: (res) => {
      useAuthStore.getState().setCredentials(res.data.user, res.data.accessToken);
    }
  });

// Me
export const useMe = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await axios.get<z.infer<typeof MeResponseSchema>>("/auth/me");
      return res.data;
    },
    retry: false
  });
};

// Forgot Password
export const useForgotPassword = () =>
  useMutation({
    mutationFn: async (data: z.infer<typeof ForgotPasswordSchema>) => {
      const res = await api.post<z.infer<typeof ForgotPasswordResponseSchema>>("/auth/forgot-password", data);
      return res.data;
    }
  });

// Reset Password
export const useResetPassword = () =>
  useMutation({
    mutationFn: async (data: z.infer<typeof ResetPasswordSchema>) => {
      const res = await api.post<z.infer<typeof ResetPasswordResponseSchema>>("/auth/reset-password", data);
      return res.data;
    }
  });

// Switch Company
export const useSwitchCompany = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async (data: z.infer<typeof SwitchCompanySchema>) => {
      const res = await axios.post<z.infer<typeof SwitchCompanyResponseSchema>>("/auth/switch-company", data);
      return res.data;
    },
    onSuccess: (res) => {
      useAuthStore.getState().setCredentials(res.data.user, res.data.accessToken);
    }
  });
};
