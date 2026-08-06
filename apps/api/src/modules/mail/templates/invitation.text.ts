import type { EmailLanguage } from "@modules/mail/domain/mail.types";

interface Props {
  companyName: string;
  acceptUrl: string | null;
  language?: EmailLanguage;
}

const COPY = {
  EN: {
    title: (companyName: string) => `You're invited to join ${companyName}`,
    withUrl: (companyName: string, acceptUrl: string) => `
    You've been invited to join ${companyName} on Outscout.

    Accept your invitation here:
    ${acceptUrl}

    ${"-".repeat(60)}

    This invitation link will expire in 7 days.`,
    withoutUrl: (companyName: string) => `
    You've been invited to join ${companyName} on Outscout.

    Log in to your Outscout account and accept the invitation from your dashboard to get started.

    ${"-".repeat(60)}

    This invitation will expire in 7 days.`,
    ignoreNote: "If you were not expecting this invitation, please ignore this email.",
    footer: (companyName: string) => `This is an automated message from ${companyName}.\nPlease do not reply to this email.`
  },
  AR: {
    title: (companyName: string) => `تمت دعوتك للانضمام إلى ${companyName}`,
    withUrl: (companyName: string, acceptUrl: string) => `
    تمت دعوتك للانضمام إلى ${companyName} على Outscout.

    اقبل دعوتك من هنا:
    ${acceptUrl}

    ${"-".repeat(60)}

    ستنتهي صلاحية رابط الدعوة هذا خلال 7 أيام.`,
    withoutUrl: (companyName: string) => `
    تمت دعوتك للانضمام إلى ${companyName} على Outscout.

    سجّل الدخول إلى حساب Outscout الخاص بك واقبل الدعوة من لوحة التحكم للبدء.

    ${"-".repeat(60)}

    ستنتهي صلاحية هذه الدعوة خلال 7 أيام.`,
    ignoreNote: "إذا لم تكن تتوقع هذه الدعوة، يرجى تجاهل هذا البريد الإلكتروني.",
    footer: (companyName: string) => `هذه رسالة تلقائية من ${companyName}.\nيرجى عدم الرد على هذا البريد الإلكتروني.`
  }
} as const;

export default function generateInvitationText({ companyName, acceptUrl, language = "EN" }: Props): string {
  const copy = COPY[language] ?? COPY.EN;
  const body = acceptUrl ? copy.withUrl(companyName, acceptUrl) : copy.withoutUrl(companyName);

  return `
    ${"=".repeat(60)}
    ${copy.title(companyName)}
    ${"=".repeat(60)}
    ${body}

    ${copy.ignoreNote}

    ${"=".repeat(60)}
    ${copy.footer(companyName)}
    ${"=".repeat(60)}
  `.trim();
}
