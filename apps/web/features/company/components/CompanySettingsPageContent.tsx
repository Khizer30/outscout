"use client";
import { useCompanySettings } from "@features/company/api/company.api";
import CompanySettingsForm from "@features/company/components/CompanySettingsForm";
import NoCompanyMessage from "@features/company/components/NoCompanyMessage";
import { useAuthStore } from "@shared/stores/authStore";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CompanySettingsPageContent() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const companyId = useAuthStore((state) => state.user?.companyId);
  const isAdmin = user?.companyRole === "COMPANY_ADMIN";

  const { data: settings, isLoading } = useCompanySettings(!!companyId && isAdmin);

  if (!companyId) {
    return (
      <div className="p-6 md:p-8">
        <NoCompanyMessage />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6 md:p-8">
      <div className="mb-6 space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">{t("companySettings.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("companySettings.description")}</p>
      </div>

      {!isAdmin && <p className="text-sm text-muted-foreground">{t("companySettings.notAdmin")}</p>}

      {isAdmin && (isLoading || !settings) && (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {isAdmin && settings && <CompanySettingsForm settings={settings} />}
    </div>
  );
}
