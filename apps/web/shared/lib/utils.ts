import { isAxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (isAxiosError<{ error?: unknown; message?: unknown }>(error)) {
    const raw = error.response?.data?.error ?? error.response?.data?.message;
    if (typeof raw === "string") {
      return raw;
    }
  }

  return fallback;
}
