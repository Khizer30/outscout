"use client";
import { getQueryClient } from "@shared/lib/reactQuery";
import type { Children } from "@shared/types/children.types";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

export default function Providers({ children }: Children): ReactNode {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
