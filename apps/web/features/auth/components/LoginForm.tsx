"use client";
import { useLogin } from "@features/auth/api/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@repo/dtos/auth";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { getErrorMessage } from "@shared/lib/error";
import { ROUTES } from "@shared/lib/routes";
import { useAuthStore } from "@shared/stores/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type { z } from "zod";

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitted }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data, {
      onSuccess: (res) => {
        useAuthStore.getState().setCredentials(res.data.user, res.data.accessToken);
        router.replace(ROUTES.dashboard);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">{t("login.email")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t("login.emailPlaceholder")}
          aria-invalid={!!((isSubmitted || dirtyFields.email) && errors.email)}
          {...register("email")}
        />
        <p className="min-h-4 text-xs text-destructive">{(isSubmitted || dirtyFields.email) && errors.email?.message}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">{t("login.password")}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={!!((isSubmitted || dirtyFields.password) && errors.password)}
          {...register("password")}
        />
        <p className="min-h-4 text-xs text-destructive">{(isSubmitted || dirtyFields.password) && errors.password?.message}</p>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={login.isPending}>
        {login.isPending ? t("login.submitting") : t("login.submit")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t("login.signupPrompt")}{" "}
        <Link href={ROUTES.auth.signup} className="font-medium text-primary hover:underline">
          {t("login.signup")}
        </Link>
      </p>
    </form>
  );
}
