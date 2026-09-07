export const ROUTES = {
  home: "/",
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    forgotPassword: "/auth/forgot-password"
  },
  dashboard: "/dashboard",
  team: "/dashboard/team",
  settings: "/dashboard/settings"
} as const;
