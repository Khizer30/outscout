declare namespace Express {
  interface Request {
    user?: {
      id: string;
      name?: string;
      email?: string;
      companyId?: string;
      companyRole?: string;
      isSuperAdmin?: boolean;
    };
  }
}
