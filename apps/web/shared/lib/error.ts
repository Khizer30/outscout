"use client";
import i18n from "@shared/lib/i18n";
import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown, fallback?: string): string {
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

  return fallback ?? i18n.t("SOMETHING_WENT_WRONG", { ns: "errors" });
}
