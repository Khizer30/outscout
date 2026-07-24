export interface User {
  id: string;
  name: string;
  profileImage?: string;
  isSuperAdmin: boolean;
  companyId?: string;
  companyName?: string;
  companyRole?: string;
}
