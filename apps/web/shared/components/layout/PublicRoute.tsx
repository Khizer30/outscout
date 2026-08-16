"use client";
import { ROUTES } from "@shared/lib/routes";
import { useAuthStore } from "@shared/stores/authStore";
import type { Children } from "@shared/types/children.types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";

export default function PublicRoute({ children }: Children): ReactNode {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (isInitialized && user) {
      router.replace(ROUTES.dashboard);
    }
  }, [isInitialized, user, router]);

  if (!isInitialized || user) {
    return null;
  }

  return children;
}
