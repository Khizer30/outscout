export interface CompanyEmailSettingsRecord {
  companyId: string;
  brevoApiKeyCipher: string | null;
  fromEmail: string | null;
  emailSignature: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  updatedAt: Date;
}
