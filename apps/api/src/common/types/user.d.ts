interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  isSuperAdmin: boolean;
  companyId?: string;
  companyRole?: string;
}
