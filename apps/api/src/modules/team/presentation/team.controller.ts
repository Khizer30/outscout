import { AuthGuard } from "@middleware/auth.guard";
import Roles from "@middleware/roles.decorator";
import { User } from "@middleware/user.decorator";
import { InvitationMapper } from "@modules/team/infrastructure/invitation.mapper";
import { TeamService } from "@modules/team/services/team.service";
import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import {
  AcceptMyInvitationResponseDto,
  InvitationEmailResponseDto,
  InviteUserDto,
  InviteUserResponseDto,
  ListInvitationsDto,
  ListInvitationsResponseDto,
  MyInvitationsResponseDto,
  RejectInvitationResponseDto,
  RevokeInvitationResponseDto
} from "@repo/dtos/team";

@Controller("team")
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post("invitations")
  @UseGuards(AuthGuard)
  @Roles(["COMPANY_ADMIN"])
  async invite(@User() user: AuthenticatedUser, @Body() dto: InviteUserDto): Promise<InviteUserResponseDto> {
    if (!user.companyId) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const invitation = await this.teamService.inviteUser(user.companyId, user.id, dto.email);

    return { data: InvitationMapper.toResponse(invitation) };
  }

  @Post("invitations/list")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Roles(["COMPANY_ADMIN"])
  async list(@User() user: AuthenticatedUser, @Body() dto: ListInvitationsDto): Promise<ListInvitationsResponseDto> {
    if (!user.companyId) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const invitations = await this.teamService.listForCompany(user.companyId, dto.status);

    return { data: invitations.map(InvitationMapper.toResponse) };
  }

  @Delete("invitations/:id")
  @UseGuards(AuthGuard)
  @Roles(["COMPANY_ADMIN"])
  async revoke(@User() user: AuthenticatedUser, @Param("id") id: string): Promise<RevokeInvitationResponseDto> {
    if (!user.companyId) {
      throw new ForbiddenException("You do not belong to a company");
    }

    await this.teamService.revokeInvitation(user.companyId, id);

    return { message: "Invitation revoked successfully" };
  }

  @Get("invitations/:id/email")
  async getEmail(@Param("id") id: string): Promise<InvitationEmailResponseDto> {
    const email = await this.teamService.getInvitationEmail(id);

    return { data: { email } };
  }

  @Get("invitations/me")
  @UseGuards(AuthGuard)
  async listMine(@User() user: AuthenticatedUser): Promise<MyInvitationsResponseDto> {
    const invitations = await this.teamService.listMyInvitations(user.id);

    return { data: invitations.map(InvitationMapper.toResponse) };
  }

  @Post("invitations/:id/accept")
  @UseGuards(AuthGuard)
  async acceptMine(@User() user: AuthenticatedUser, @Param("id") id: string): Promise<AcceptMyInvitationResponseDto> {
    const { invitation } = await this.teamService.acceptInvitationById(id, user.id);

    return { data: InvitationMapper.toResponse(invitation) };
  }

  @Post("invitations/:id/reject")
  @UseGuards(AuthGuard)
  async rejectMine(@User() user: AuthenticatedUser, @Param("id") id: string): Promise<RejectInvitationResponseDto> {
    await this.teamService.rejectInvitationById(id, user.id);

    return { message: "Invitation rejected successfully" };
  }
}
