"use client";
import { useSignup } from "@features/auth/api/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@repo/dtos/auth";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { ROUTES } from "@shared/lib/routes";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { z } from "zod";

type SignupFormValues = z.infer<typeof SignupSchema>;

export default function SignupForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const signup = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields }
  } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    mode: "onTouched"
  });

  const onSubmit = (data: SignupFormValues) => {
    signup.mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message);
        setSubmittedEmail(data.email);
      },
      onError: (error) => {
        const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
        toast.error(message);
      }
    });
  };

  if (submittedEmail) {
    return (
      <div className="space-y-2 text-center">
        <p className="text-sm text-foreground">
          We&apos;ve sent a verification code to <span className="font-medium">{submittedEmail}</span>.
        </p>
        <p className="text-sm text-muted-foreground">Check your inbox to verify your account.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Muhammad Khizer"
          aria-invalid={!!(dirtyFields.name && errors.name)}
          {...register("name")}
        />
        <p className="min-h-4 text-xs text-destructive">{dirtyFields.name && errors.name?.message}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="khizer@company.com"
          aria-invalid={!!(dirtyFields.email && errors.email)}
          {...register("email")}
        />
        <p className="min-h-4 text-xs text-destructive">{dirtyFields.email && errors.email?.message}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="newPassword"
          placeholder="••••••••"
          aria-invalid={!!(dirtyFields.password && errors.password)}
          {...register("password")}
        />
        <p className="min-h-4 text-xs text-destructive">{dirtyFields.password && errors.password?.message}</p>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={signup.isPending}>
        {signup.isPending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={ROUTES.auth.login} className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
