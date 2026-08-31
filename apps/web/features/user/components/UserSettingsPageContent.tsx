"use client";
import UserSettingsForm from "@features/user/components/UserSettingsForm";
import { useTranslation } from "react-i18next";

export default function UserSettingsPageContent() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto w-full max-w-2xl p-6 md:p-8">
      <div className="mb-6 space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">{t("settings.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("settings.description")}</p>
      </div>
      <UserSettingsForm />
    </div>
  );
}
