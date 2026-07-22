import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Signup
export const SignupResponseSchema = z.object({
  message: z.string()
});

export class SignupResponseDto extends createZodDto(SignupResponseSchema) {}

// Verify User
export const VerifyUserResponseSchema = z.object({
  message: z.string()
});

export class VerifyUserResponseDto extends createZodDto(VerifyUserResponseSchema) {}

// Login
export const LoginResponseSchema = z.object({
  data: z.object({
    accessToken: z.string()
  })
});

export class LoginResponseDto extends createZodDto(LoginResponseSchema) {}

// Forgot Password
export const ForgotPasswordResponseSchema = z.object({
  message: z.string()
});

export class ForgotPasswordResponseDto extends createZodDto(ForgotPasswordResponseSchema) {}

// Reset Password
export const ResetPasswordResponseSchema = z.object({
  message: z.string()
});

export class ResetPasswordResponseDto extends createZodDto(ResetPasswordResponseSchema) {}

// Refresh
export const RefreshResponseSchema = z.object({
  data: z.object({
    accessToken: z.string()
  })
});

export class RefreshResponseDto extends createZodDto(RefreshResponseSchema) {}

// Logout
export const LogoutResponseSchema = z.object({
  message: z.string()
});

export class LogoutResponseDto extends createZodDto(LogoutResponseSchema) {}

// Me
export const MeResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    name: z.string(),
    profileImage: z.string().optional(),
    isSuperAdmin: z.boolean(),
    companyId: z.string().optional(),
    companyName: z.string().optional(),
    companyRole: z.string().optional()
  })
});

export class MeResponseDto extends createZodDto(MeResponseSchema) {}

// Switch Company
export const SwitchCompanyResponseSchema = z.object({
  data: z.object({
    accessToken: z.string()
  })
});

export class SwitchCompanyResponseDto extends createZodDto(SwitchCompanyResponseSchema) {}

// Delete Account
export const DeleteAccountResponseSchema = z.object({
  message: z.string()
});

export class DeleteAccountResponseDto extends createZodDto(DeleteAccountResponseSchema) {}
