import { randomInt } from "crypto";
import { InvalidOtpError, ExpiredOtpError, InvalidCredentialsError, UserNotVerifiedError, InvalidSessionError } from "@modules/auth/domain/auth.errors";
import { SessionEntity } from "@modules/auth/domain/session.entity";
import { SessionRepository } from "@modules/auth/domain/session.repository";
import { VerificationEntity } from "@modules/auth/domain/verification.entity";
import { VerificationRepository } from "@modules/auth/domain/verification.repository";
import { OtpConfig } from "@modules/auth/domain/verification.value-objects";
import { CompanyEntity } from "@modules/company/domain/company.entity";
import { CompanyMembershipNotFoundError } from "@modules/company/domain/company.errors";
import { CompanyRepository } from "@modules/company/domain/company.repository";
import { CompanyMembershipEntity } from "@modules/company/domain/companyMembership.entity";
import { EncryptionService } from "@modules/encryption/services/encryption.service";
import { JWTService } from "@modules/jwt/services/jwt.service";
import { MailService } from "@modules/mail/services/mail.service";
import { InvitationEmailMismatchError } from "@modules/team/domain/invitation.errors";
import { TeamService } from "@modules/team/services/team.service";
import { UserEntity } from "@modules/user/domain/user.entity";
import { UserAlreadyExistsError, UserNotFoundError } from "@modules/user/domain/user.errors";
import { UserService } from "@modules/user/services/user.service";
import { Injectable } from "@nestjs/common";
import { SignupDto, VerifyUserDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, SwitchCompanyDto } from "@repo/dtos/auth";
import { type JwtPayload } from "jsonwebtoken";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly verificationRepo: VerificationRepository,
    private readonly sessionRepo: SessionRepository,
    private readonly companyRepo: CompanyRepository,
    private readonly mailService: MailService,
    private readonly jwtService: JWTService,
    private readonly encryptionService: EncryptionService,
    private readonly teamService: TeamService
  ) {}

  private buildAccessTokenPayload(user: UserEntity, active?: { company: CompanyEntity; membership: CompanyMembershipEntity }): AuthenticatedUser {
    return {
      id: user.id,
      name: user.name,
      profileImage: user.profileImageURL ?? undefined,
      isSuperAdmin: user.isSuperAdmin,
      companyId: active?.company.id,
      companyName: active?.company.name,
      companyRole: active?.membership.role
    };
  }

  async signup(dto: SignupDto): Promise<UserEntity> {
    if (dto.invitationToken) {
      const invitation = await this.teamService.validateToken(dto.invitationToken);
      if (invitation.email.toLowerCase() !== dto.email.toLowerCase()) {
        throw new InvitationEmailMismatchError({ expected: invitation.email });
      }
    }

    const existing = await this.userService.findByEmail(dto.email);
    let user: UserEntity;

    if (existing) {
      if (existing.isVerified) {
        throw new UserAlreadyExistsError({ email: dto.email });
      }

      user = await this.userService.updateUserEntity(existing, {
        name: dto.name,
        password: dto.password,
        timezone: dto.timezone
      });

      await this.verificationRepo.deleteByUserId(user.id);
    } else {
      user = await this.userService.createUser(dto);
    }

    const otp = randomInt(100000, 1000000).toString();

    const verification = VerificationEntity.create({
      userId: user.id,
      type: "VERIFY",
      otp,
      expiresAt: new Date(Date.now() + OtpConfig.EXPIRY_MS)
    });

    await this.verificationRepo.create(verification);

    await this.mailService.sendVerificationEmail(user.email, user.name, otp);

    return user;
  }

  async verifyUser(dto: VerifyUserDto): Promise<void> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UserNotFoundError({ email: dto.email });
    }

    const verification = await this.verificationRepo.findActive(user.id, dto.otp, "VERIFY");
    if (!verification) {
      throw new InvalidOtpError({ email: dto.email, otp: dto.otp });
    }

    if (verification.expiresAt < new Date()) {
      throw new ExpiredOtpError({ email: dto.email, otp: dto.otp });
    }

    const updatedVerification = verification.markAsUsed();
    await this.verificationRepo.update(updatedVerification);

    await this.userService.verifyUser(user);

    if (dto.invitationToken) {
      const invitation = await this.teamService.validateToken(dto.invitationToken);
      await this.teamService.acceptInvitationById(invitation.id, user.id);
    }
  }

  async login(dto: LoginDto, ipAddress: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.encryptionService.comparePasswords(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    if (!user.isVerified) {
      throw new UserNotVerifiedError();
    }

    const activeMemberships = await this.companyRepo.findActiveMembershipsByUserId(user.id);
    const active = activeMemberships[0];

    const accessToken = this.jwtService.generateAccessToken(this.buildAccessTokenPayload(user, active));
    const refreshToken = this.jwtService.generateRefreshToken({ id: user.id });

    const refreshTokenHash = await this.encryptionService.hashToken(refreshToken);
    const expiryTime = new Date(Date.now() + this.jwtService.refreshTokenMaxAge);

    const session = SessionEntity.create({
      userId: user.id,
      refreshTokenHash,
      ipAddress,
      expiryTime
    });

    await this.sessionRepo.deleteByUserId(user.id);
    await this.sessionRepo.create(session);

    return { accessToken, refreshToken };
  }

  async refresh(token: string, ipAddress: string): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: JwtPayload | string;
    try {
      payload = this.jwtService.verifyRefreshToken(token);
    } catch {
      throw new InvalidSessionError();
    }

    if (!payload || typeof payload === "string" || !payload.data || !payload.data.id) {
      throw new InvalidSessionError();
    }

    const userId = payload.data.id;
    const user = await this.userService.findById(userId);
    if (!user || !user.isVerified) {
      throw new InvalidSessionError();
    }

    const refreshTokenHash = await this.encryptionService.hashToken(token);
    const session = await this.sessionRepo.findByHash(refreshTokenHash);
    if (!session) {
      throw new InvalidSessionError();
    }

    if (session.expiryTime < new Date()) {
      await this.sessionRepo.delete(session.id);
      throw new InvalidSessionError();
    }

    const activeMemberships = await this.companyRepo.findActiveMembershipsByUserId(user.id);
    const active = activeMemberships[0];

    const newAccessToken = this.jwtService.generateAccessToken(this.buildAccessTokenPayload(user, active));
    const newRefreshToken = this.jwtService.generateRefreshToken({ id: user.id });

    const newRefreshTokenHash = await this.encryptionService.hashToken(newRefreshToken);
    const newExpiryTime = new Date(Date.now() + this.jwtService.refreshTokenMaxAge);

    const updatedSession = new SessionEntity(session.id, session.userId, newRefreshTokenHash, ipAddress, newExpiryTime, session.createdAt);
    await this.sessionRepo.update(updatedSession);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(token: string): Promise<void> {
    const refreshTokenHash = await this.encryptionService.hashToken(token);
    const session = await this.sessionRepo.findByHash(refreshTokenHash);
    if (session) {
      await this.sessionRepo.delete(session.id);
    }
  }

  async deleteAccount(userId: string): Promise<void> {
    await this.userService.deleteUserById(userId);
    await this.sessionRepo.deleteByUserId(userId);
  }

  async switchCompany(userId: string, ipAddress: string, dto: SwitchCompanyDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findById(userId);
    if (!user || !user.isVerified) {
      throw new InvalidSessionError();
    }

    const [active] = await this.companyRepo.findActiveMembershipsByUserId(userId, dto.membershipId);
    if (!active) {
      throw new CompanyMembershipNotFoundError({ membershipId: dto.membershipId });
    }

    const newAccessToken = this.jwtService.generateAccessToken(this.buildAccessTokenPayload(user, active));
    const newRefreshToken = this.jwtService.generateRefreshToken({ id: user.id });

    const refreshTokenHash = await this.encryptionService.hashToken(newRefreshToken);
    const expiryTime = new Date(Date.now() + this.jwtService.refreshTokenMaxAge);

    const session = SessionEntity.create({
      userId: user.id,
      refreshTokenHash,
      ipAddress,
      expiryTime
    });

    await this.sessionRepo.deleteByUserId(user.id);
    await this.sessionRepo.create(session);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UserNotFoundError({ email: dto.email });
    }

    await this.verificationRepo.deleteByUserId(user.id);

    const otp = randomInt(100000, 1000000).toString();

    const verification = VerificationEntity.create({
      userId: user.id,
      type: "RESET",
      otp,
      expiresAt: new Date(Date.now() + OtpConfig.EXPIRY_MS)
    });

    await this.verificationRepo.create(verification);

    await this.mailService.sendResetEmail(user.email, user.name, otp);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UserNotFoundError({ email: dto.email });
    }

    const verification = await this.verificationRepo.findActive(user.id, dto.otp, "RESET");
    if (!verification) {
      throw new InvalidOtpError({ email: dto.email, otp: dto.otp });
    }

    if (verification.expiresAt < new Date()) {
      throw new ExpiredOtpError({ email: dto.email, otp: dto.otp });
    }

    const updatedVerification = verification.markAsUsed();
    await this.verificationRepo.update(updatedVerification);

    await this.userService.updateUserEntity(user, { password: dto.newPassword });
  }
}
