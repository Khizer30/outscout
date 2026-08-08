import i18n from "@shared/lib/i18n";
import { isAxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (isAxiosError<{ code?: unknown; message?: unknown }>(error)) {
    const code = error.response?.data?.code;
    if (typeof code === "string" && i18n.exists(code, { ns: "errors" })) {
      return i18n.t(code, { ns: "errors" });
    }

    const raw = error.response?.data?.message;
    if (typeof raw === "string") {
      return raw;
    }
  }

  return fallback;
}
