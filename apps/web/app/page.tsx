"use client";
import { ROUTES } from "@shared/lib/routes";
import { useAuthStore } from "@shared/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    router.replace(user ? ROUTES.dashboard : ROUTES.auth.login);
  }, [user, router]);

  return null;
}
