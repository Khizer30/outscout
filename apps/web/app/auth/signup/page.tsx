import SignupCardHeader from "@features/auth/components/SignupCardHeader";
import SignupForm from "@features/auth/components/SignupForm";
import { Card, CardContent } from "@shared/components/ui/card";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign up"
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-sm">
        <SignupCardHeader />
        <CardContent>
          <Suspense>
            <SignupForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
