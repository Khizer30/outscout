"use client";
import type { Children } from "@shared/types/children.types";
import { createContext, useContext, useState } from "react";

interface ForgotPasswordContextValue {
  submittedEmail: string | null;
  isResetStep: boolean;
  setSubmittedEmail: (email: string | null) => void;
  setIsResetStep: (value: boolean) => void;
}

const ForgotPasswordContext = createContext<ForgotPasswordContextValue | null>(null);

export function ForgotPasswordProvider({ children }: Children) {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [isResetStep, setIsResetStep] = useState(false);

  return <ForgotPasswordContext.Provider value={{ submittedEmail, isResetStep, setSubmittedEmail, setIsResetStep }}>{children}</ForgotPasswordContext.Provider>;
}

export function useForgotPasswordContext() {
  const ctx = useContext(ForgotPasswordContext);
  if (!ctx) {
    throw new Error("useForgotPasswordContext must be used within ForgotPasswordProvider");
  }
  return ctx;
}
