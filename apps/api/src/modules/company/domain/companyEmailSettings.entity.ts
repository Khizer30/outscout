export class CompanyEmailSettingsEntity {
  constructor(
    public readonly companyId: string,
    public readonly brevoApiKeyCipher: string | null,
    public readonly fromEmail: string | null,
    public readonly emailSignature: string | null,
    public readonly primaryColor: string | null,
    public readonly secondaryColor: string | null,
    public readonly updatedAt: Date
  ) {}

  static create(props: {
    companyId: string;
    brevoApiKeyCipher?: string | null;
    fromEmail?: string | null;
    emailSignature?: string | null;
    primaryColor?: string | null;
    secondaryColor?: string | null;
    updatedAt?: Date;
  }): CompanyEmailSettingsEntity {
    return new CompanyEmailSettingsEntity(
      props.companyId,
      props.brevoApiKeyCipher ?? null,
      props.fromEmail ?? null,
      props.emailSignature ?? null,
      props.primaryColor ?? null,
      props.secondaryColor ?? null,
      props.updatedAt ?? new Date()
    );
  }

  update(props: {
    brevoApiKeyCipher?: string | null;
    fromEmail?: string | null;
    emailSignature?: string | null;
    primaryColor?: string | null;
    secondaryColor?: string | null;
  }): CompanyEmailSettingsEntity {
    return new CompanyEmailSettingsEntity(
      this.companyId,
      props.brevoApiKeyCipher !== undefined ? props.brevoApiKeyCipher : this.brevoApiKeyCipher,
      props.fromEmail !== undefined ? props.fromEmail : this.fromEmail,
      props.emailSignature !== undefined ? props.emailSignature : this.emailSignature,
      props.primaryColor !== undefined ? props.primaryColor : this.primaryColor,
      props.secondaryColor !== undefined ? props.secondaryColor : this.secondaryColor,
      new Date()
    );
  }
}
