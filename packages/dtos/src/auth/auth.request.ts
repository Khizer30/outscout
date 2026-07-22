import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Signup
export const SignupSchema = z.object({
  name: z.string({ error: "Name is required" }).trim().min(1, { error: "Name is required" }),
  email: z.email({ error: "Enter a valid email address" }).trim(),
  password: z
    .string({ error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { error: "Password must contain at least 1 lowercase letter" })
    .regex(/[A-Z]/, { error: "Password must contain at least 1 uppercase letter" })
    .regex(/[0-9]/, { error: "Password must contain at least 1 digit" })
    .regex(/[^a-zA-Z0-9]/, { error: "Password must contain at least 1 special character" }),
  timezone: z.string({ error: "Timezone must be a string" }).trim().optional(),
  invitationToken: z.string({ error: "Invitation token must be a string" }).trim().min(1).optional()
});

export class SignupDto extends createZodDto(SignupSchema) {}

// Verify User
export const VerifyUserSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }).trim(),
  otp: z.string({ error: "OTP is required" }).trim().length(6, { error: "OTP must be exactly 6 characters long" }),
  invitationToken: z.string({ error: "Invitation token must be a string" }).trim().min(1).optional()
});

export class VerifyUserDto extends createZodDto(VerifyUserSchema) {}

// Login
export const LoginSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }).trim(),
  password: z.string({ error: "Password is required" })
});

export class LoginDto extends createZodDto(LoginSchema) {}

// Forgot Password
export const ForgotPasswordSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }).trim()
});

export class ForgotPasswordDto extends createZodDto(ForgotPasswordSchema) {}

// Reset Password
export const ResetPasswordSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }).trim(),
  otp: z.string({ error: "OTP is required" }).trim().length(6, { error: "OTP must be exactly 6 characters long" }),
  newPassword: z
    .string({ error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { error: "Password must contain at least 1 lowercase letter" })
    .regex(/[A-Z]/, { error: "Password must contain at least 1 uppercase letter" })
    .regex(/[0-9]/, { error: "Password must contain at least 1 digit" })
    .regex(/[^a-zA-Z0-9]/, { error: "Password must contain at least 1 special character" })
});

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}

// Switch Company
export const SwitchCompanySchema = z.object({
  membershipId: z.string({ error: "Membership ID is required" }).trim().min(1, { error: "Membership ID is required" })
});

export class SwitchCompanyDto extends createZodDto(SwitchCompanySchema) {}
