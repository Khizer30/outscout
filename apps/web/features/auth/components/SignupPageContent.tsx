"use client";
import SignupCardHeader from "@features/auth/components/SignupCardHeader";
import SignupForm from "@features/auth/components/SignupForm";
import { SignupProvider } from "@features/auth/context/SignupContext";
import { CardContent } from "@shared/components/ui/card";

export default function SignupPageContent() {
  return (
    <SignupProvider>
      <SignupCardHeader />
      <CardContent>
        <SignupForm />
      </CardContent>
    </SignupProvider>
  );
}
