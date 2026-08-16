"use client";
import { useVerifyUser } from "@features/auth/api/auth.api";
import { useSignupContext } from "@features/auth/context/SignupContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifyUserSchema } from "@repo/dtos/auth";
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

type VerifyOtpFormValues = z.infer<typeof VerifyUserSchema>;

export default function VerifyOtpForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const verifyUser = useVerifyUser();
  const { submittedEmail, invitationToken, setSubmittedEmail, setIsVerifyStep } = useSignupContext();
  const email = submittedEmail ?? "";

  const onBack = () => {
    setSubmittedEmail(null);
    setIsVerifyStep(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitted }
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(VerifyUserSchema),
    defaultValues: { email, otp: "", invitationToken }
  });

  const onSubmit = (data: VerifyOtpFormValues) => {
    verifyUser.mutate(data, {
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
        <Trans i18nKey="verifyOtp.description" values={{ email }} components={{ bold: <span className="font-medium text-foreground" /> }} />
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="otp">{t("verifyOtp.otp")}</Label>
        <Input
          id="otp"
          type="text"
          inputMode="numeric"
          autoComplete="oneTimeCode"
          maxLength={6}
          placeholder={t("verifyOtp.otpPlaceholder")}
          aria-invalid={!!((isSubmitted || dirtyFields.otp) && errors.otp)}
          {...register("otp")}
        />
        <p className="min-h-4 text-xs text-destructive">{(isSubmitted || dirtyFields.otp) && errors.otp?.message}</p>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={verifyUser.isPending}>
        {verifyUser.isPending ? t("verifyOtp.submitting") : t("verifyOtp.submit")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <button type="button" onClick={onBack} className="font-medium text-primary hover:underline">
          {t("verifyOtp.backToSignup")}
        </button>
      </p>
    </form>
  );
}
