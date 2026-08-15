"use client";
import LoginForm from "@features/auth/components/LoginForm";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card";
import { useTranslation } from "react-i18next";

export default function LoginPageContent() {
  const { t } = useTranslation();

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">{t("login.title")}</CardTitle>
        <CardDescription>{t("login.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </>
  );
}
