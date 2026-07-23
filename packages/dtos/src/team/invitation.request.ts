import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Invite User
export const InviteUserSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }).trim()
});

export class InviteUserDto extends createZodDto(InviteUserSchema) {}
