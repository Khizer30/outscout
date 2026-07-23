import { createId } from "@paralleldrive/cuid2";

export class CompanyEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly about: string | null,
    public readonly companyImageURL: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null
  ) {}

  static create(props: {
    id?: string;
    name: string;
    about?: string | null;
    companyImageURL?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  }): CompanyEntity {
    return new CompanyEntity(
      props.id ?? createId(),
      props.name,
      props.about ?? null,
      props.companyImageURL ?? null,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
      props.deletedAt ?? null
    );
  }

  update(props: { name?: string; about?: string | null; companyImageURL?: string | null }): CompanyEntity {
    return new CompanyEntity(
      this.id,
      props.name ?? this.name,
      props.about !== undefined ? props.about : this.about,
      props.companyImageURL !== undefined ? props.companyImageURL : this.companyImageURL,
      this.createdAt,
      new Date(),
      this.deletedAt
    );
  }

  delete(): CompanyEntity {
    return new CompanyEntity(this.id, this.name, this.about, this.companyImageURL, this.createdAt, new Date(), new Date());
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
