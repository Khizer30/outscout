import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Invite User
export const InviteUserSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }).trim()
});

export class InviteUserDto extends createZodDto(InviteUserSchema) {}

// List Invitations
export const ListInvitationsSchema = z.object({
  status: z.array(z.enum(["PENDING", "ACCEPTED", "REJECTED", "REVOKED", "EXPIRED"])).min(1, { error: "Select at least one status" })
});

export class ListInvitationsDto extends createZodDto(ListInvitationsSchema) {}
