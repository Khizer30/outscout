interface Props {
  companyName: string;
  acceptUrl: string | null;
}

export default function generateInvitationText({ companyName, acceptUrl }: Props): string {
  const body = acceptUrl
    ? `
    You've been invited to join ${companyName} on Outscout.

    Accept your invitation here:
    ${acceptUrl}

    ${"-".repeat(60)}

    This invitation link will expire in 7 days.`
    : `
    You've been invited to join ${companyName} on Outscout.

    Log in to your Outscout account and accept the invitation from your dashboard to get started.

    ${"-".repeat(60)}

    This invitation will expire in 7 days.`;

  return `
    ${"=".repeat(60)}
    You're invited to join ${companyName}
    ${"=".repeat(60)}
    ${body}

    If you were not expecting this invitation, please ignore this email.

    ${"=".repeat(60)}
    This is an automated message from ${companyName}.
    Please do not reply to this email.
    ${"=".repeat(60)}
  `.trim();
}
