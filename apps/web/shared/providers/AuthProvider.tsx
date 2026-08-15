"use client";
import type { RefreshResponseDto } from "@repo/dtos/auth";
import { api } from "@shared/lib/axios";
import { useAuthStore } from "@shared/stores/authStore";
import type { Children } from "@shared/types/children.types";
import { useEffect } from "react";
import type { ReactNode } from "react";

export default function AuthProvider({ children }: Children): ReactNode {
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (isInitialized) {
      return;
    }

    let cancelled = false;

    api
      .get<RefreshResponseDto>("/auth/refresh")
      .then((res) => {
        if (cancelled) {
          return;
        }
        useAuthStore.getState().setCredentials(res.data.data.user, res.data.data.accessToken);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        useAuthStore.getState().logout();
      });

    return () => {
      cancelled = true;
    };
  }, [isInitialized]);

  return children;
}
