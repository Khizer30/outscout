import LoginPageContent from "@features/auth/components/LoginPageContent";
import { Card } from "@shared/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in"
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-sm">
        <LoginPageContent />
      </Card>
    </div>
  );
}
