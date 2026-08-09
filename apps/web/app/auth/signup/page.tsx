import SignupPageContent from "@features/auth/components/SignupPageContent";
import { Card } from "@shared/components/ui/card";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign up"
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-sm">
        <Suspense>
          <SignupPageContent />
        </Suspense>
      </Card>
    </div>
  );
}
