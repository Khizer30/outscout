"use client";
import { useForgotPassword } from "@features/auth/api/auth.api";
import { useForgotPasswordContext } from "@features/auth/context/ForgotPasswordContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "@repo/dtos/auth";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { getErrorMessage } from "@shared/lib/error";
import { ROUTES } from "@shared/lib/routes";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type { z } from "zod";

type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const { t } = useTranslation();
  const forgotPassword = useForgotPassword();
  const { setSubmittedEmail, setIsResetStep } = useForgotPasswordContext();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitted }
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { email: "" }
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPassword.mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message ?? t("forgotPassword.success"));
        setSubmittedEmail(data.email);
        setIsResetStep(true);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">{t("forgotPassword.email")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t("forgotPassword.emailPlaceholder")}
          aria-invalid={!!((isSubmitted || dirtyFields.email) && errors.email)}
          {...register("email")}
        />
        <p className="min-h-4 text-xs text-destructive">
          {(isSubmitted || dirtyFields.email) && errors.email?.message && t(`errors:${errors.email.message}`)}
        </p>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={forgotPassword.isPending}>
        {forgotPassword.isPending ? t("forgotPassword.submitting") : t("forgotPassword.submit")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href={ROUTES.auth.login} className="font-medium text-primary hover:underline">
          {t("forgotPassword.backToLogin")}
        </Link>
      </p>
    </form>
  );
}
