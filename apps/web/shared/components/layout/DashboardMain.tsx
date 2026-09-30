"use client";
import type { Children } from "@shared/types/children.types";
import { useTranslation } from "react-i18next";

export default function DashboardMain({ children }: Children) {
  const { i18n } = useTranslation();

  return (
    <main dir={i18n.dir()} className="flex-1 overflow-auto">
      {children}
    </main>
  );
}
