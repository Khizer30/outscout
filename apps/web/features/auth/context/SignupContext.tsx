"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

interface SignupContextValue {
  isVerifyStep: boolean;
  setIsVerifyStep: (isVerifyStep: boolean) => void;
  submittedEmail: string | null;
  setSubmittedEmail: (email: string | null) => void;
  invitationToken: string | undefined;
  setInvitationToken: (token: string | undefined) => void;
}

const SignupContext = createContext<SignupContextValue | null>(null);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [isVerifyStep, setIsVerifyStep] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [invitationToken, setInvitationToken] = useState<string | undefined>(undefined);

  return (
    <SignupContext.Provider value={{ isVerifyStep, setIsVerifyStep, submittedEmail, setSubmittedEmail, invitationToken, setInvitationToken }}>
      {children}
    </SignupContext.Provider>
  );
}

export function useSignupContext() {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignupContext must be used within a SignupProvider");
  }

  return context;
}
