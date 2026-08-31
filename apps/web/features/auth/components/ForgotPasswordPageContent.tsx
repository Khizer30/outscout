"use client";
import ForgotPasswordForm from "@features/auth/components/ForgotPasswordForm";
import ResetPasswordForm from "@features/auth/components/ResetPasswordForm";
import { ForgotPasswordProvider, useForgotPasswordContext } from "@features/auth/context/ForgotPasswordContext";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card";
import { useTranslation } from "react-i18next";

function ForgotPasswordPageInner() {
  const { t } = useTranslation();
  const { isResetStep } = useForgotPasswordContext();

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">{isResetStep ? t("resetPassword.title") : t("forgotPassword.title")}</CardTitle>
        <CardDescription>{isResetStep ? "" : t("forgotPassword.description")}</CardDescription>
      </CardHeader>
      <CardContent>{isResetStep ? <ResetPasswordForm /> : <ForgotPasswordForm />}</CardContent>
    </>
  );
}

export default function ForgotPasswordPageContent() {
  return (
    <ForgotPasswordProvider>
      <ForgotPasswordPageInner />
    </ForgotPasswordProvider>
  );
}
