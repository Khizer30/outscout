import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Signup
export const SignupResponseSchema = z.object({
  message: z.string()
});

export class SignupResponseDto extends createZodDto(SignupResponseSchema) {}

// Verify OTP
export const VerifyOtpResponseSchema = z.object({
  message: z.string()
});

export class VerifyOtpResponseDto extends createZodDto(VerifyOtpResponseSchema) {}

// Login
export const LoginResponseSchema = z.object({
  data: z.object({
    accessToken: z.string()
  })
});

export class LoginResponseDto extends createZodDto(LoginResponseSchema) {}
