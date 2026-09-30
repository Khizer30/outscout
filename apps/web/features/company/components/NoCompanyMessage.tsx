"use client";
import { useTranslation } from "react-i18next";

export default function NoCompanyMessage() {
  const { t } = useTranslation();

  return (
    <div role="status" className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
      {t("companySettings.noCompany")}
    </div>
  );
}
