"use client";
import "@shared/lib/i18n";
import type { Children } from "@shared/types/children.types";

export default function I18nProvider({ children }: Children) {
  return <>{children}</>;
}
