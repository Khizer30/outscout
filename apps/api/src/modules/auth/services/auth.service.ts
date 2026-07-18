import { randomInt } from "crypto";
import { InvalidOtpError, ExpiredOtpError, InvalidCredentialsError, UserNotVerifiedError, InvalidSessionError } from "@modules/auth/domain/auth.errors";
import { SessionEntity } from "@modules/auth/domain/session.entity";
import { SessionRepository } from "@modules/auth/domain/session.repository";
import { VerificationEntity } from "@modules/auth/domain/verification.entity";
import { VerificationRepository } from "@modules/auth/domain/verification.repository";
import { OtpConfig } from "@modules/auth/domain/verification.value-objects";
import { CompanyRepository } from "@modules/company/domain/company.repository";
import { EncryptionService } from "@modules/encryption/services/encryption.service";
import { JWTService } from "@modules/jwt/services/jwt.service";
import { MailService } from "@modules/mail/services/mail.service";
import { UserEntity } from "@modules/user/domain/user.entity";
import { UserAlreadyExistsError, UserNotFoundError } from "@modules/user/domain/user.errors";
import { UserService } from "@modules/user/services/user.service";
import { Injectable } from "@nestjs/common";
import { SignupDto, VerifyUserDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from "@repo/dtos/auth";
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
    private readonly encryptionService: EncryptionService
  ) {}

  async signup(dto: SignupDto): Promise<UserEntity> {
    const existing = await this.userService.findByEmail(dto.email);
    let user: UserEntity;

    if (existing) {
      if (existing.isVerified) {
        throw new UserAlreadyExistsError({ email: dto.email });
      }

      user = await this.userService.updateUser(existing, {
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

    const memberships = await this.companyRepo.findActiveMembershipsByUserId(user.id);
    const membership = memberships[0];

    const accessTokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      companyId: membership?.companyId,
      companyRole: membership?.role
    };
    const refreshTokenPayload = { id: user.id };

    const accessToken = this.jwtService.generateAccessToken(accessTokenPayload);
    const refreshToken = this.jwtService.generateRefreshToken(refreshTokenPayload);

    const refreshTokenHash = this.encryptionService.hashToken(refreshToken);
    const expiryTime = new Date(Date.now() + this.jwtService.refreshTokenMaxAge);

    const session = SessionEntity.create({
      userId: user.id,
      refreshTokenHash,
      ipAddress,
      expiryTime
    });

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

    const refreshTokenHash = this.encryptionService.hashToken(token);
    const session = await this.sessionRepo.findByHash(refreshTokenHash);
    if (!session) {
      throw new InvalidSessionError();
    }

    if (session.expiryTime < new Date()) {
      await this.sessionRepo.delete(session.id);
      throw new InvalidSessionError();
    }

    const memberships = await this.companyRepo.findActiveMembershipsByUserId(user.id);
    const membership = memberships[0];

    const accessTokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      companyId: membership?.companyId,
      companyRole: membership?.role
    };
    const refreshTokenPayload = { id: user.id };

    const newAccessToken = this.jwtService.generateAccessToken(accessTokenPayload);
    const newRefreshToken = this.jwtService.generateRefreshToken(refreshTokenPayload);

    const newRefreshTokenHash = this.encryptionService.hashToken(newRefreshToken);
    const newExpiryTime = new Date(Date.now() + this.jwtService.refreshTokenMaxAge);

    const updatedSession = new SessionEntity(session.id, session.userId, newRefreshTokenHash, ipAddress, newExpiryTime, session.createdAt);
    await this.sessionRepo.update(updatedSession);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(token: string): Promise<void> {
    const refreshTokenHash = this.encryptionService.hashToken(token);
    const session = await this.sessionRepo.findByHash(refreshTokenHash);
    if (session) {
      await this.sessionRepo.delete(session.id);
    }
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

    await this.userService.updateUser(user, { password: dto.newPassword });
  }
}
