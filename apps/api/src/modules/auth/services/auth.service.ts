import { randomInt } from "crypto";
import { VerificationEntity } from "@modules/auth/domain/verification.entity";
import { VerificationRepository } from "@modules/auth/domain/verification.repository";
import { OtpConfig } from "@modules/auth/domain/verification.value-objects";
import { MailService } from "@modules/mail/services/mail.service";
import { UserEntity } from "@modules/user/domain/user.entity";
import { UserService } from "@modules/user/services/user.service";
import { Injectable } from "@nestjs/common";
import { SignupDto } from "@repo/dtos/auth";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly verificationRepo: VerificationRepository,
    private readonly mailService: MailService
  ) {}

  async signup(dto: SignupDto): Promise<UserEntity> {
    const user = await this.userService.createUser(dto);

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
}
