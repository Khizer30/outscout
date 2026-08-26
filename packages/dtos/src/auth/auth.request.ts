import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Signup
export const SignupSchema = z.object({
  name: z.string({ error: "VALIDATION_NAME_REQUIRED" }).trim().min(1, { error: "VALIDATION_NAME_REQUIRED" }),
  email: z.email({ error: "VALIDATION_EMAIL_INVALID" }).trim(),
  password: z
    .string({ error: "VALIDATION_PASSWORD_REQUIRED" })
    .min(8, { error: "VALIDATION_PASSWORD_MIN_LENGTH" })
    .regex(/[a-z]/, { error: "VALIDATION_PASSWORD_LOWERCASE_REQUIRED" })
    .regex(/[A-Z]/, { error: "VALIDATION_PASSWORD_UPPERCASE_REQUIRED" })
    .regex(/[0-9]/, { error: "VALIDATION_PASSWORD_DIGIT_REQUIRED" })
    .regex(/[^a-zA-Z0-9]/, { error: "VALIDATION_PASSWORD_SPECIAL_CHAR_REQUIRED" }),
  timezone: z.string({ error: "VALIDATION_TIMEZONE_INVALID" }).trim().optional(),
  invitationToken: z.string({ error: "VALIDATION_INVITATION_TOKEN_INVALID" }).trim().min(1).optional()
});

export class SignupDto extends createZodDto(SignupSchema) {}

// Verify User
export const VerifyUserSchema = z.object({
  email: z.email({ error: "VALIDATION_EMAIL_INVALID" }).trim(),
  otp: z.string({ error: "VALIDATION_OTP_REQUIRED" }).trim().length(6, { error: "VALIDATION_OTP_LENGTH" }),
  invitationToken: z.string({ error: "VALIDATION_INVITATION_TOKEN_INVALID" }).trim().min(1).optional()
});

export class VerifyUserDto extends createZodDto(VerifyUserSchema) {}

// Login
export const LoginSchema = z.object({
  email: z.email({ error: "VALIDATION_EMAIL_INVALID" }).trim(),
  password: z.string({ error: "VALIDATION_PASSWORD_REQUIRED" })
});

export class LoginDto extends createZodDto(LoginSchema) {}

// Forgot Password
export const ForgotPasswordSchema = z.object({
  email: z.email({ error: "VALIDATION_EMAIL_INVALID" }).trim()
});

export class ForgotPasswordDto extends createZodDto(ForgotPasswordSchema) {}

// Reset Password
export const ResetPasswordSchema = z.object({
  email: z.email({ error: "VALIDATION_EMAIL_INVALID" }).trim(),
  otp: z.string({ error: "VALIDATION_OTP_REQUIRED" }).trim().length(6, { error: "VALIDATION_OTP_LENGTH" }),
  newPassword: z
    .string({ error: "VALIDATION_PASSWORD_REQUIRED" })
    .min(8, { error: "VALIDATION_PASSWORD_MIN_LENGTH" })
    .regex(/[a-z]/, { error: "VALIDATION_PASSWORD_LOWERCASE_REQUIRED" })
    .regex(/[A-Z]/, { error: "VALIDATION_PASSWORD_UPPERCASE_REQUIRED" })
    .regex(/[0-9]/, { error: "VALIDATION_PASSWORD_DIGIT_REQUIRED" })
    .regex(/[^a-zA-Z0-9]/, { error: "VALIDATION_PASSWORD_SPECIAL_CHAR_REQUIRED" })
});

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}

// Switch Company
export const SwitchCompanySchema = z.object({
  membershipId: z.string({ error: "VALIDATION_MEMBERSHIP_ID_REQUIRED" }).trim().min(1, { error: "VALIDATION_MEMBERSHIP_ID_REQUIRED" })
});

export class SwitchCompanyDto extends createZodDto(SwitchCompanySchema) {}
