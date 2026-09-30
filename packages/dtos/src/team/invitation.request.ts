import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Invite User
export const InviteUserSchema = z.object({
  email: z.email({ error: "VALIDATION_EMAIL_INVALID" }).trim()
});

export class InviteUserDto extends createZodDto(InviteUserSchema) {}

// List Invitations
export const ListInvitationsSchema = z.object({
  status: z.array(z.enum(["PENDING", "ACCEPTED", "REJECTED", "REVOKED", "EXPIRED"])).min(1, { error: "VALIDATION_STATUS_MIN_ONE" })
});

export class ListInvitationsDto extends createZodDto(ListInvitationsSchema) {}
