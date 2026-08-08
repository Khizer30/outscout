"use client";
import { CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card";
import { useTranslation } from "react-i18next";

export default function SignupCardHeader() {
  const { t } = useTranslation();

  return (
    <CardHeader>
      <CardTitle className="text-2xl">{t("signup.title")}</CardTitle>
      <CardDescription>{t("signup.description")}</CardDescription>
    </CardHeader>
  );
}
