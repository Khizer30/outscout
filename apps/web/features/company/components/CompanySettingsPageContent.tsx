"use client";
import { useCompanySettings } from "@features/company/api/company.api";
import CompanySettingsForm from "@features/company/components/CompanySettingsForm";
import { useAuthStore } from "@shared/stores/authStore";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CompanySettingsPageContent() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const hasCompany = !!user?.companyId;
  const isAdmin = user?.companyRole === "COMPANY_ADMIN";

  const { data: settings, isLoading } = useCompanySettings(hasCompany && isAdmin);

  return (
    <div className="mx-auto w-full max-w-3xl p-6 md:p-8">
      <div className="mb-6 space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">{t("companySettings.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("companySettings.description")}</p>
      </div>

      {!hasCompany && <p className="text-sm text-muted-foreground">{t("companySettings.noCompany")}</p>}

      {hasCompany && !isAdmin && <p className="text-sm text-muted-foreground">{t("companySettings.notAdmin")}</p>}

      {hasCompany && isAdmin && (isLoading || !settings) && (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {hasCompany && isAdmin && settings && <CompanySettingsForm settings={settings} />}
    </div>
  );
}
