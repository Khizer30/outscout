export const ROUTES = {
  home: "/",
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    forgotPassword: "/auth/forgot-password"
  },
  dashboard: "/dashboard",
  company: "/dashboard/company",
  team: "/dashboard/team",
  settings: "/dashboard/settings"
} as const;
