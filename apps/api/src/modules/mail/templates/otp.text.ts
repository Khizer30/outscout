import type { EmailType } from "@modules/mail/domain/mail.types";

interface Props {
  type: EmailType;
  receiverName: string;
  otp: string;
  senderName?: string;
  companyName: string;
}

export default function generateOtpText({ type, receiverName, otp, senderName, companyName }: Props): string {
  const title = type === "verify" ? "Verify Your Email" : "Reset Your Password";
  const message = type === "verify" ? "Use the following OTP to verify your email." : "Use the following OTP to reset your password.";

  return `
    ${"=".repeat(60)}
    ${title}
    ${"=".repeat(60)}

    Hi ${receiverName},

    ${message}

    ${"-".repeat(60)}
    YOUR OTP CODE
    ${"-".repeat(60)}

    ${otp}

    ${"-".repeat(60)}

    This OTP will expire in 10 minutes.

    If you did not request this, please ignore this email.

    ${"=".repeat(60)}
    This is an automated message from ${senderName ?? companyName}.
    Please do not reply to this email.
    ${"=".repeat(60)}
  `.trim();
}
