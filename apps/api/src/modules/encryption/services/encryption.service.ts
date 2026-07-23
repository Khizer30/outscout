import { randomBytes, createCipheriv, createDecipheriv, createHash } from "crypto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { genSalt, hash, compare } from "bcrypt";

@Injectable()
export class EncryptionService {
  private readonly encryptionKey: Buffer;

  constructor(private readonly configService: ConfigService) {
    const rawKey = this.configService.getOrThrow<string>("ENCRYPTION_KEY");

    this.encryptionKey = createHash("sha256").update(rawKey).digest();
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  async comparePasswords(text: string, hash: string): Promise<boolean> {
    return compare(text, hash);
  }

  async hashToken(token: string): Promise<string> {
    return createHash("sha256").update(token).digest("hex");
  }

  encrypt(text: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.encryptionKey, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
  }

  decrypt(cipherText: string): string {
    const parts = cipherText.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid cipher text format");
    }

    const [ivHex, authTagHex, encrypted] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = createDecipheriv("aes-256-gcm", this.encryptionKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}
