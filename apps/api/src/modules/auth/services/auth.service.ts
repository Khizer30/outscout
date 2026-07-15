import { randomInt } from "crypto";
import { InvalidOtpError, ExpiredOtpError, InvalidCredentialsError, UserNotVerifiedError } from "@modules/auth/domain/auth.errors";
import { VerificationEntity } from "@modules/auth/domain/verification.entity";
import { VerificationRepository } from "@modules/auth/domain/verification.repository";
import { OtpConfig } from "@modules/auth/domain/verification.value-objects";
import { EncryptionService } from "@modules/encryption/services/encryption.service";
import { JWTService } from "@modules/jwt/services/jwt.service";
import { MailService } from "@modules/mail/services/mail.service";
import { UserEntity } from "@modules/user/domain/user.entity";
import { UserAlreadyExistsError, UserNotFoundError } from "@modules/user/domain/user.errors";
import { UserService } from "@modules/user/services/user.service";
import { Injectable } from "@nestjs/common";
import { SignupDto, VerifyUserDto, LoginDto, ForgotPasswordDto } from "@repo/dtos/auth";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly verificationRepo: VerificationRepository,
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

  async login(dto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
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

    const accessTokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin
    };
    const refreshTokenPayload = { id: user.id };

    const accessToken = this.jwtService.generateAccessToken(accessTokenPayload);
    const refreshToken = this.jwtService.generateRefreshToken(refreshTokenPayload);

    return { accessToken, refreshToken };
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
}
