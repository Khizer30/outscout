declare namespace Express {
  interface Request {
    user?: {
      id: string;
      name: string;
      email: string;
      isSuperAdmin: boolean;
      companyId?: string;
      companyRole?: string;
    };
  }
}
