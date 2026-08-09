"use client";
import { useSignupContext } from "@features/auth/context/SignupContext";
import { CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card";
import { useTranslation } from "react-i18next";

export default function SignupCardHeader() {
  const { t } = useTranslation();
  const { isVerifyStep } = useSignupContext();

  return (
    <CardHeader>
      <CardTitle className="text-2xl">{isVerifyStep ? t("verifyOtp.title") : t("signup.title")}</CardTitle>
      <CardDescription>{isVerifyStep ? "" : t("signup.description")}</CardDescription>
    </CardHeader>
  );
}
