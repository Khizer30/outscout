"use client";
import CompanyDetailsCard from "@features/company/components/CompanyDetailsCard";
import CompanyEmailSettingsCard from "@features/company/components/CompanyEmailSettingsCard";
import CompanyMessageRulesCard from "@features/company/components/CompanyMessageRulesCard";
import { CompanySettingsProvider, useCompanySettingsContext, type CompanySettingsData } from "@features/company/components/CompanySettingsProvider";
import { Button } from "@shared/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CompanySettingsFormProps {
  settings: CompanySettingsData;
}

export default function CompanySettingsForm({ settings }: CompanySettingsFormProps) {
  return (
    <CompanySettingsProvider settings={settings}>
      <CompanySettingsFormContent />
    </CompanySettingsProvider>
  );
}

function CompanySettingsFormContent() {
  const { t } = useTranslation();
  const { handleSubmit, onSubmit, saving, uploading } = useCompanySettingsContext();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <CompanyDetailsCard />
      <CompanyEmailSettingsCard />
      <CompanyMessageRulesCard />

      <div className="flex justify-end">
        <Button type="submit" disabled={saving || uploading}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {saving ? t("companySettings.saving") : t("companySettings.save")}
        </Button>
      </div>
    </form>
  );
}
