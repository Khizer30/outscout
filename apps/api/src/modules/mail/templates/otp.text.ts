import type { EmailLanguage, EmailType } from "@modules/mail/domain/mail.types";

interface Props {
  type: EmailType;
  receiverName: string;
  otp: string;
  senderName?: string;
  companyName: string;
  language?: EmailLanguage;
}

const COPY = {
  EN: {
    title: { verify: "Verify Your Email", reset: "Reset Your Password" },
    message: { verify: "Use the following OTP to verify your email.", reset: "Use the following OTP to reset your password." },
    greeting: (name: string) => `Hi ${name},`,
    otpLabel: "YOUR OTP CODE",
    expiry: "This OTP will expire in 10 minutes.",
    ignoreNote: "If you did not request this, please ignore this email.",
    footer: (name: string) => `This is an automated message from ${name}.\nPlease do not reply to this email.`
  },
  AR: {
    title: { verify: "تحقق من بريدك الإلكتروني", reset: "إعادة تعيين كلمة المرور" },
    message: { verify: "استخدم رمز التحقق التالي للتحقق من بريدك الإلكتروني.", reset: "استخدم رمز التحقق التالي لإعادة تعيين كلمة المرور." },
    greeting: (name: string) => `مرحبًا ${name}،`,
    otpLabel: "رمز التحقق الخاص بك",
    expiry: "ستنتهي صلاحية هذا الرمز خلال 10 دقائق.",
    ignoreNote: "إذا لم تطلب هذا، يرجى تجاهل هذا البريد الإلكتروني.",
    footer: (name: string) => `هذه رسالة تلقائية من ${name}.\nيرجى عدم الرد على هذا البريد الإلكتروني.`
  }
} as const;

export default function generateOtpText({ type, receiverName, otp, senderName, companyName, language = "EN" }: Props): string {
  const copy = COPY[language] ?? COPY.EN;
  const title = copy.title[type];
  const message = copy.message[type];

  return `
    ${"=".repeat(60)}
    ${title}
    ${"=".repeat(60)}

    ${copy.greeting(receiverName)}

    ${message}

    ${"-".repeat(60)}
    ${copy.otpLabel}
    ${"-".repeat(60)}

    ${otp}

    ${"-".repeat(60)}

    ${copy.expiry}

    ${copy.ignoreNote}

    ${"=".repeat(60)}
    ${copy.footer(senderName ?? companyName)}
    ${"=".repeat(60)}
  `.trim();
}
