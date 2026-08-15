"use client";
import { ROUTES } from "@shared/lib/routes";
import { useAuthStore } from "@shared/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    router.replace(user ? ROUTES.dashboard : ROUTES.auth.login);
  }, [isInitialized, user, router]);

  return null;
}
