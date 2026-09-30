"use client";
import { useResetPassword } from "@features/auth/api/auth.api";
import { useForgotPasswordContext } from "@features/auth/context/ForgotPasswordContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@repo/dtos/auth";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { getErrorMessage } from "@shared/lib/error";
import { ROUTES } from "@shared/lib/routes";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Trans, useTranslation } from "react-i18next";
import type { z } from "zod";

type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const resetPassword = useResetPassword();
  const { submittedEmail, setSubmittedEmail, setIsResetStep } = useForgotPasswordContext();
  const email = submittedEmail ?? "";

  const onBack = () => {
    setSubmittedEmail(null);
    setIsResetStep(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitted }
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email, otp: "", newPassword: "" }
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPassword.mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message);
        router.replace(ROUTES.auth.login);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <p className="text-sm text-muted-foreground">
        <Trans i18nKey="resetPassword.description" values={{ email }} components={{ bold: <span className="font-medium text-foreground" /> }} />
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="otp">{t("resetPassword.otp")}</Label>
        <Input
          id="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder={t("resetPassword.otpPlaceholder")}
          aria-invalid={!!((isSubmitted || dirtyFields.otp) && errors.otp)}
          {...register("otp")}
        />
        <p className="min-h-4 text-xs text-destructive">{(isSubmitted || dirtyFields.otp) && errors.otp?.message && t(`errors:${errors.otp.message}`)}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newPassword">{t("resetPassword.newPassword")}</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          aria-invalid={!!((isSubmitted || dirtyFields.newPassword) && errors.newPassword)}
          {...register("newPassword")}
        />
        <p className="min-h-4 text-xs text-destructive">
          {(isSubmitted || dirtyFields.newPassword) && errors.newPassword?.message && t(`errors:${errors.newPassword.message}`)}
        </p>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={resetPassword.isPending}>
        {resetPassword.isPending ? t("resetPassword.submitting") : t("resetPassword.submit")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <button type="button" onClick={onBack} className="font-medium text-primary hover:underline">
          {t("resetPassword.backToForgotPassword")}
        </button>
      </p>
    </form>
  );
}
