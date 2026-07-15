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
  timezone: z.string({ error: "Timezone must be a string" }).trim().optional()
});

export class SignupDto extends createZodDto(SignupSchema) {}

// Verify OTP
export const VerifyOtpSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }).trim(),
  otp: z.string({ error: "OTP is required" }).trim().length(6, { error: "OTP must be exactly 6 characters long" })
});

export class VerifyOtpDto extends createZodDto(VerifyOtpSchema) {}

// Login
export const LoginSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }).trim(),
  password: z.string({ error: "Password is required" })
});

export class LoginDto extends createZodDto(LoginSchema) {}
