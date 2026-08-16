"use client";
import i18n from "@shared/lib/i18n";
import type { Children } from "@shared/types/children.types";
import { useEffect } from "react";

function syncDocumentLanguage(lng: string) {
  document.documentElement.lang = lng;
  document.documentElement.dir = i18n.dir(lng);
}

export default function I18nProvider({ children }: Children) {
  useEffect(() => {
    syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language);
    i18n.on("languageChanged", syncDocumentLanguage);
    return () => {
      i18n.off("languageChanged", syncDocumentLanguage);
    };
  }, []);

  return <>{children}</>;
}
