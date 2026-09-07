import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Invited By User
export const InvitedByUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  profileImage: z.string().nullable()
});

export type InvitedByUserDto = z.infer<typeof InvitedByUserSchema>;

// Company Invitation
export const CompanyInvitationResponseSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  email: z.string(),
  role: z.enum(["COMPANY_ADMIN", "COMPANY_USER"]),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "REVOKED", "EXPIRED"]),
  invitedBy: InvitedByUserSchema.nullable(),
  expiresAt: z.date(),
  acceptedAt: z.date().nullable(),
  createdAt: z.date()
});

export class CompanyInvitationResponseDto extends createZodDto(CompanyInvitationResponseSchema) {}

// Invite User
export const InviteUserResponseSchema = z.object({
  data: CompanyInvitationResponseSchema
});

export class InviteUserResponseDto extends createZodDto(InviteUserResponseSchema) {}

// List Invitations
export const ListInvitationsResponseSchema = z.object({
  data: z.array(CompanyInvitationResponseSchema)
});

export class ListInvitationsResponseDto extends createZodDto(ListInvitationsResponseSchema) {}

// Revoke Invitation
export const RevokeInvitationResponseSchema = z.object({
  message: z.string()
});

export class RevokeInvitationResponseDto extends createZodDto(RevokeInvitationResponseSchema) {}

// My Invitations
export const MyCompanyInvitationResponseSchema = CompanyInvitationResponseSchema.extend({
  companyName: z.string()
});

export class MyCompanyInvitationResponseDto extends createZodDto(MyCompanyInvitationResponseSchema) {}

export const MyInvitationsResponseSchema = z.object({
  data: z.array(MyCompanyInvitationResponseSchema)
});

export class MyInvitationsResponseDto extends createZodDto(MyInvitationsResponseSchema) {}

// Invitation Email
export const InvitationEmailResponseSchema = z.object({
  data: z.object({
    email: z.string()
  })
});

export class InvitationEmailResponseDto extends createZodDto(InvitationEmailResponseSchema) {}

// Accept My Invitation
export const AcceptMyInvitationResponseSchema = z.object({
  data: CompanyInvitationResponseSchema
});

export class AcceptMyInvitationResponseDto extends createZodDto(AcceptMyInvitationResponseSchema) {}

// Reject Invitation
export const RejectInvitationResponseSchema = z.object({
  message: z.string()
});

export class RejectInvitationResponseDto extends createZodDto(RejectInvitationResponseSchema) {}

// Team Member
export const TeamMemberResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  profileImage: z.string().nullable(),
  role: z.enum(["COMPANY_ADMIN", "COMPANY_USER"]),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  joinedAt: z.date()
});

export class TeamMemberResponseDto extends createZodDto(TeamMemberResponseSchema) {}

// List Team Members
export const ListTeamMembersResponseSchema = z.object({
  data: z.array(TeamMemberResponseSchema)
});

export class ListTeamMembersResponseDto extends createZodDto(ListTeamMembersResponseSchema) {}
