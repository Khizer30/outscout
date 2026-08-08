"use client";
import { useSignup } from "@features/auth/api/auth.api";
import { useInvitationEmail } from "@features/team/api/team.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@repo/dtos/auth";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { getErrorMessage } from "@shared/lib/error";
import { ROUTES } from "@shared/lib/routes";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Trans, useTranslation } from "react-i18next";
import type { z } from "zod";

type SignupFormValues = z.infer<typeof SignupSchema>;

export default function SignupForm() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || undefined;
  const { data: invitationEmail, error: invitationError } = useInvitationEmail(token ?? "");
  const invitedEmail = invitationEmail?.data.email;

  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const signup = useSignup();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, dirtyFields, isSubmitted }
  } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    mode: "onTouched",
    defaultValues: {
      invitationToken: token,
      email: ""
    }
  });

  useEffect(() => {
    if (token) {
      setValue("invitationToken", token);
    }
    if (invitedEmail) {
      setValue("email", invitedEmail);
    }
  }, [token, invitedEmail, setValue]);

  const onSubmit = (data: SignupFormValues) => {
    signup.mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message);
        setSubmittedEmail(data.email);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      }
    });
  };

  if (submittedEmail) {
    return (
      <div className="space-y-2 text-center">
        <p className="text-sm text-foreground">
          <Trans i18nKey="signup.verificationSent" values={{ email: submittedEmail }} components={{ bold: <span className="font-medium" /> }} />
        </p>
        <p className="text-sm text-muted-foreground">{t("signup.verificationInstructions")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {token && invitationError && <div className="rounded-md bg-destructive/10 p-3 text-xs text-destructive">{getErrorMessage(invitationError)}</div>}
      {token && !invitationError && <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">{t("signup.invitationNotice")}</div>}

      <div className="space-y-1.5">
        <Label htmlFor="name">{t("signup.name")}</Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          placeholder={t("signup.namePlaceholder")}
          aria-invalid={!!((isSubmitted || dirtyFields.name) && errors.name)}
          {...register("name")}
        />
        <p className="min-h-4 text-xs text-destructive">{(isSubmitted || dirtyFields.name) && errors.name?.message}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">{t("signup.email")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t("signup.emailPlaceholder")}
          disabled={!!invitedEmail}
          aria-invalid={!!((isSubmitted || dirtyFields.email) && errors.email)}
          {...register("email")}
        />
        <p className="min-h-4 text-xs text-destructive">{(isSubmitted || dirtyFields.email) && errors.email?.message}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">{t("signup.password")}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="newPassword"
          placeholder="••••••••"
          aria-invalid={!!((isSubmitted || dirtyFields.password) && errors.password)}
          {...register("password")}
        />
        <p className="min-h-4 text-xs text-destructive">{(isSubmitted || dirtyFields.password) && errors.password?.message}</p>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={signup.isPending}>
        {signup.isPending ? t("signup.submitting") : t("signup.submit")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t("signup.loginPrompt")}{" "}
        <Link href={ROUTES.auth.login} className="font-medium text-primary hover:underline">
          {t("signup.login")}
        </Link>
      </p>
    </form>
  );
}
