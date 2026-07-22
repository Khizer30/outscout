interface Props {
  companyName: string;
  acceptUrl: string;
}

export default function generateInvitationText({ companyName, acceptUrl }: Props): string {
  return `
    ${"=".repeat(60)}
    You're invited to join ${companyName}
    ${"=".repeat(60)}

    You've been invited to join ${companyName} on Outscout.

    Accept your invitation here:
    ${acceptUrl}

    ${"-".repeat(60)}

    This invitation link will expire in 7 days.

    If you were not expecting this invitation, please ignore this email.

    ${"=".repeat(60)}
    This is an automated message from ${companyName}.
    Please do not reply to this email.
    ${"=".repeat(60)}
  `.trim();
}
