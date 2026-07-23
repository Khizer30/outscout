import { CompanyEntity } from "@modules/company/domain/company.entity";
import { CompanyNotFoundError } from "@modules/company/domain/company.errors";
import { CompanyRepository } from "@modules/company/domain/company.repository";
import { CompanyEmailSettingsRepository } from "@modules/company/domain/companyEmailSettings.repository";
import { CompanyMembershipEntity } from "@modules/company/domain/companyMembership.entity";
import { EncryptionService } from "@modules/encryption/services/encryption.service";
import { JWTService } from "@modules/jwt/services/jwt.service";
import { MailService } from "@modules/mail/services/mail.service";
import { CompanyInvitationEntity } from "@modules/team/domain/invitation.entity";
import {
  InvitationAlreadyProcessedError,
  InvitationEmailMismatchError,
  InvitationExpiredError,
  InvitationNotFoundError,
  InvitationPendingExistsError,
  InvitationTokenInvalidError,
  UserAlreadyCompanyMemberError
} from "@modules/team/domain/invitation.errors";
import { InvitationRepository } from "@modules/team/domain/invitation.repository";
import { InvitationTokenPayload, InvitedByUserSummary } from "@modules/team/domain/invitation.types";
import { InvitationConfig } from "@modules/team/domain/invitation.value-objects";
import { UserService } from "@modules/user/services/user.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TeamService {
  constructor(
    private readonly invitationRepo: InvitationRepository,
    private readonly companyRepo: CompanyRepository,
    private readonly companyEmailSettingsRepo: CompanyEmailSettingsRepository,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtService: JWTService,
    private readonly encryptionService: EncryptionService,
    private readonly configService: ConfigService
  ) {}

  async inviteUser(companyId: string, invitedByUserId: string, email: string): Promise<CompanyInvitationEntity> {
    const company = await this.companyRepo.findById(companyId);
    if (!company) {
      throw new CompanyNotFoundError({ companyId });
    }

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      const [existingMembership] = await this.companyRepo.findActiveMembershipsByUserId(existingUser.id, undefined, companyId);
      if (existingMembership) {
        throw new UserAlreadyCompanyMemberError({ email });
      }
    }

    const inviterUser = await this.userService.findById(invitedByUserId);
    const invitedBy: InvitedByUserSummary | null = inviterUser
      ? {
          id: inviterUser.id,
          name: inviterUser.name,
          email: inviterUser.email,
          profileImage: inviterUser.profileImageURL ?? null
        }
      : null;

    const expiresAt = new Date(Date.now() + InvitationConfig.EXPIRY_MS);
    const [pending] = await this.invitationRepo.findPendingByCompany(companyId, email);

    let invitation: CompanyInvitationEntity;

    if (pending) {
      if (!pending.isExpired()) {
        throw new InvitationPendingExistsError({ email });
      }

      const token = this.jwtService.generateInvitationToken({ invitationId: pending.id, email, companyId }, InvitationConfig.EXPIRY);

      const saved = await this.invitationRepo.update(pending.resend(token, expiresAt));
      if (!saved) {
        throw new InvitationNotFoundError({ id: pending.id });
      }

      invitation = saved;
    } else {
      const draft = CompanyInvitationEntity.create({ companyId, email, invitedBy, token: "", expiresAt });
      const token = this.jwtService.generateInvitationToken({ invitationId: draft.id, email, companyId }, InvitationConfig.EXPIRY);
      invitation = await this.invitationRepo.create(draft.withToken(token));
    }

    await this.sendInvitationEmail(company, invitation, existingUser !== null);

    return invitation;
  }

  async listPendingForCompany(companyId: string): Promise<CompanyInvitationEntity[]> {
    return this.invitationRepo.findPendingByCompany(companyId);
  }

  async listMyInvitations(userId: string): Promise<CompanyInvitationEntity[]> {
    const user = await this.userService.getUserById(userId);
    const invitations = await this.invitationRepo.findPendingByEmail(user.email);

    return invitations.filter((invitation) => !invitation.isExpired());
  }

  async getInvitationEmail(invitationId: string): Promise<string> {
    const invitation = await this.invitationRepo.findById(invitationId);
    if (!invitation) {
      throw new InvitationNotFoundError({ id: invitationId });
    }

    return invitation.email;
  }

  async revokeInvitation(companyId: string, invitationId: string): Promise<CompanyInvitationEntity> {
    const invitation = await this.invitationRepo.findById(invitationId);
    if (!invitation || invitation.companyId !== companyId) {
      throw new InvitationNotFoundError({ id: invitationId });
    }

    if (invitation.status !== "PENDING") {
      throw new InvitationAlreadyProcessedError({ status: invitation.status });
    }

    const saved = await this.invitationRepo.update(invitation.revoke());
    if (!saved) {
      throw new InvitationNotFoundError({ id: invitationId });
    }

    return saved;
  }

  async validateToken(token: string): Promise<CompanyInvitationEntity> {
    let payload: InvitationTokenPayload;
    try {
      payload = this.jwtService.verifyInvitationToken<InvitationTokenPayload>(token);
    } catch {
      throw new InvitationTokenInvalidError();
    }

    const invitation = await this.invitationRepo.findById(payload.invitationId);
    if (!invitation || invitation.token !== token) {
      throw new InvitationNotFoundError();
    }

    if (invitation.status === "ACCEPTED" || invitation.status === "REVOKED" || invitation.status === "REJECTED") {
      throw new InvitationAlreadyProcessedError({ status: invitation.status });
    }

    if (invitation.status === "EXPIRED" || invitation.isExpired()) {
      throw new InvitationExpiredError({ id: invitation.id });
    }

    return invitation;
  }

  async acceptInvitationById(
    invitationId: string,
    userId: string
  ): Promise<{ company: CompanyEntity; membership: CompanyMembershipEntity; invitation: CompanyInvitationEntity }> {
    const user = await this.userService.getUserById(userId);
    const invitation = await this.loadActionableInvitation(invitationId, user.email);

    return this.createMembershipForInvitation(invitation, userId);
  }

  async rejectInvitationById(invitationId: string, userId: string): Promise<CompanyInvitationEntity> {
    const user = await this.userService.getUserById(userId);
    const invitation = await this.loadActionableInvitation(invitationId, user.email);

    const saved = await this.invitationRepo.update(invitation.reject());
    if (!saved) {
      throw new InvitationNotFoundError({ id: invitationId });
    }

    return saved;
  }

  private async loadActionableInvitation(invitationId: string, userEmail: string): Promise<CompanyInvitationEntity> {
    const invitation = await this.invitationRepo.findById(invitationId);
    if (!invitation) {
      throw new InvitationNotFoundError({ id: invitationId });
    }

    if (invitation.status !== "PENDING") {
      throw new InvitationAlreadyProcessedError({ status: invitation.status });
    }

    if (invitation.isExpired()) {
      throw new InvitationExpiredError({ id: invitation.id });
    }

    if (invitation.email.toLowerCase() !== userEmail.toLowerCase()) {
      throw new InvitationEmailMismatchError({ expected: invitation.email });
    }

    return invitation;
  }

  private async createMembershipForInvitation(
    invitation: CompanyInvitationEntity,
    userId: string
  ): Promise<{ company: CompanyEntity; membership: CompanyMembershipEntity; invitation: CompanyInvitationEntity }> {
    const company = await this.companyRepo.findById(invitation.companyId);
    if (!company) {
      throw new CompanyNotFoundError({ companyId: invitation.companyId });
    }

    const [existingMembership] = await this.companyRepo.findActiveMembershipsByUserId(userId, undefined, invitation.companyId);
    const membership =
      existingMembership?.membership ??
      (await this.companyRepo.addMembership(
        CompanyMembershipEntity.create({ companyId: invitation.companyId, userId, role: invitation.role, status: "ACTIVE" })
      ));

    const saved = await this.invitationRepo.update(invitation.accept());
    if (!saved) {
      throw new InvitationNotFoundError({ id: invitation.id });
    }

    return { company, membership, invitation: saved };
  }

  private async sendInvitationEmail(company: CompanyEntity, invitation: CompanyInvitationEntity, isExistingUser: boolean): Promise<void> {
    const frontendUrl = this.configService.getOrThrow<string>("FRONTEND_URL");
    const acceptUrl = isExistingUser ? null : `${frontendUrl}/auth/signup?token=${invitation.token}`;

    const settings = await this.companyEmailSettingsRepo.findByCompanyId(company.id);
    const decryptedApiKey = settings?.brevoApiKeyCipher ? this.encryptionService.decrypt(settings.brevoApiKeyCipher) : null;

    await this.mailService.sendInvitationEmail(invitation.email, acceptUrl, {
      decryptedApiKey,
      fromEmail: settings?.fromEmail,
      companyName: company.name,
      primaryColor: settings?.primaryColor,
      secondaryColor: settings?.secondaryColor,
      companyImageURL: company.companyImageURL
    });
  }
}
